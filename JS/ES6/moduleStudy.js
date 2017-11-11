function up() {

    var name = 'jansti'
    let another = 'justin'
    function sayHi() {
        console.log(name)
    }

    function sayHello() {
        console.log(another)
    }

    return [sayHi, sayHello]
}

let array = up()
array[0]()
array[1]()