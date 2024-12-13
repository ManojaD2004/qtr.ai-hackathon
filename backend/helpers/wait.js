function waitFor(milSec) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, milSec);
    });
}

module.exports = {waitFor}