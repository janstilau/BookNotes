


function actionMake() {
    var a = 100;
    return function () {
        console.log(a);
    };
}

function sayHi(action) {
    var a = 1000;
    action();
}
sayHi(actionMake());

