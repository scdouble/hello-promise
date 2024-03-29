class Promise {
  constructor(executor) {
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
      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onResolved(data);
        });
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

      setTimeout(() => {
        self.callbacks.forEach((item) => {
          item.onRejected(data);
        });
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
  then(onResolved, onRejected) {
    const self = this;
    // コールバックの条件判定 コールバック関数が指定されていない時に関数を付与
    if (typeof onRejected !== "function") {
      onRejected = (reason) => {
        throw reason;
      };
    }

    if (typeof onResolved !== "function") {
      onResolved = (value) => {
        return value;
      };
    }
    return new Promise((resolve, reject) => {
      // 同じ処理の関数を切り出す
      function callback(type) {
        try {
          // コールバックの結果を取得
          let result = type(self.PromiseResult);
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
      // then のコールバックを実行
      if (this.PromiseState === "fulfilled") {
        setTimeout(() => {
          callback(onResolved);
        });
      }
      if (this.PromiseState === "rejected") {
        setTimeout(() => {
          callback(onRejected);
        });
      }
      if (this.PromiseState === "pending") {
        //　コールバック関数を保存
        this.callbacks.push({
          onResolved: function () {
            callback(onResolved);
          },
          onRejected: function () {
            callback(onRejected);
          },
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  static resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      } else {
        resolve(value);
      }
    });
  };

  static reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  };

  static all = function (promises) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let arr = [];
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (value) => {
            count++;
            arr[i] = value;
            // 全部が成功した時のみ実行
            if (count === promises.length) {
              resolve(arr);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  };

  static race = function (promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (value) => {
            // 先に実行したpromiseが状態を変更する
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  };
}
