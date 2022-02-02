function Promise(executor) {
  // 属性を追加
  this.PromiseState = "pending";
  this.PromiseResult = null;
  this.callbacks = [];
  // thisの値を保存
  const self = this;

  function resolve(data) {
    // 状態がすでに更新していたかどうかを判断する
    if (self.PromiseState !== "pending") {
      return;
    }
    // 状態を変更(PromiseState)
    self.PromiseState = "fulfilled";
    // 結果を設定(PromiseResult)
    self.PromiseResult = data;
    // 成功したコールバックを実行
    // if (self.callback.onResolved) {
    //   self.callback.onResolved(data);
    // }
    self.callbacks.forEach((item) => {
      item.onResolved(data);
    });
  }

  function reject(data) {
    // 状態がすでに更新していたかどうかを判断する
    if (self.PromiseState !== "pending") {
      return;
    }
    // 状態を変更(PromiseState)
    self.PromiseState = "rejected";
    // 結果を設定(PromiseResult)
    self.PromiseResult = data;
    // 失敗のコールバックを実行
    // if (self.callback.onRejected) {
    //   self.callback.onRejected(data);
    // }

    self.callbacks.forEach((item) => {
      item.onRejected(data);
    });
  }

  try {
    // 同期で実行
    executor(resolve, reject);
  } catch (e) {
    // promise objectの状態を失敗にする
    reject(e);
  }
}

// thenメソッドを追加
Promise.prototype.then = function (onResolved, onRejected) {
  const self = this;
  return new Promise((resolve, reject) => {
    // then のコールバックを実行
    if (this.PromiseState === "fulfilled") {
      try {
        // コールバックの結果を取得
        let result = onResolved(this.PromiseResult);
        if (result instanceof Promise) {
          //Promise型のオブジェクトなら
          result.then(
            (value) => {
              resolve(value);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          // 対象状態を成功に変更する
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    }
    if (this.PromiseState === "rejected") {
      onRejected(this.PromiseResult);
    }
    if (this.PromiseState === "pending") {
      //　コールバック関数を保存
      this.callbacks.push({
        onResolved: function () {
          try {
            let result = onResolved(self.PromiseResult);
            if (result instanceof Promise) {
              result.then(
                (value) => {
                  resolve(value);
                },
                (reason) => {
                  reject(reason);
                }
              );
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        },
        onRejected: function () {
          try {
            let result = onRejected(self.PromiseResult);
            if (result instanceof Promise) {
              result.then(
                (value) => {
                  resolve(value);
                },
                (reason) => {
                  reject(reason);
                }
              );
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        },
      });
    }
  });
};
