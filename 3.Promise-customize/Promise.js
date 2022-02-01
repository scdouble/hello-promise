function Promise(executor) {
  // 属性を追加
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // thisの値を保存
  const self = this;

  function resolve(data) {
    // 状態がすでに更新していたかどうかを判断する
    if (self.PromiseState !== "pending") return;
    // 状態を変更(PromiseState)
    self.PromiseState = "fulfilled";
    // 結果を設定(PromiseResult)
    self.PromiseResult = data;
  }
  function reject(data) {
    // 状態がすでに更新していたかどうかを判断する
    if (self.PromiseState !== "pending") return;
    // 状態を変更(PromiseState)
    self.PromiseState = "rejected";
    // 結果を設定(PromiseResult)
    self.PromiseResult = data;
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
  // then のコールバックを実行
  if (this.PromiseState === "fulfilled") {
    onResolved(this.PromiseResult);
  }
  if (this.PromiseState === "rejected") {
    onRejected(this.PromiseResult);
  }
};
