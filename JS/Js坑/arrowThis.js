let obj = {
    bar: function(callback) {
           callback()
    },
    name: 'jansi'
}

this.name = 'globalObject'
obj.bar(() => {
    console.log(this.name)
})

obj.bar(function() {
    let fun = () => {
        console.log(this.name)
    }
    fun()
})





