class Panel {
    constructor(options) {
        // const stopButton = document.createElement("div");
        // stopButton.style.cssText = "position:absolute; bottom:57px; width:40px; height:40px; background:rgba(255, 255, 255, 0.5); border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
        // document.body.appendChild(stopButton)
        // stopButton.addEventListener('click',ev => {
        //     ev.preventDefault()
        //     if (this.onMove!==undefined)
        //         this.onMove.call(this.game, 0, 0);
        // })

        const leftButton = document.createElement("div");
        leftButton.innerHTML = '<'
        leftButton.style.cssText = "position:absolute;" +
            " bottom:60px;" +
            "font-size:30px;" +
            " background:rgba(126, 126, 126, 0.5);" +
            " border:#444 solid medium;" +
            " right:50%;" +
            " transform:translateX(-30px);";
        document.body.appendChild(leftButton)
        leftButton.addEventListener('click',(ev => {
            ev.preventDefault()
            this.onMove.call(this.game, 0, -Math.PI/2);
        }))

        const rightButton = document.createElement("div");
        rightButton.innerHTML = '>'
        rightButton.style.cssText = "position:absolute;" +
            " bottom:60px;" +
            "font-size:30px;" +
            " background:rgba(126, 126, 126, 0.5);" +
            " border:#444 solid medium;" +
            " left:50%;"
            + " transform:translateX(30px);";
        document.body.appendChild(rightButton)
        rightButton.addEventListener('click',(ev => {
            ev.preventDefault()
            this.onMove.call(this.game, 0, Math.PI/2);
        }))

        const upButton = document.createElement("div");
        upButton.innerHTML = '>'
        upButton.style.cssText = "position:absolute;" +
            " bottom:100px;" +
            "font-size:30px;" +
            " background:rgba(126, 126, 126, 0.5);" +
            " border:#444 solid medium;" +
            " left:50%;" +
            " transform:translateX(-10px) rotate(-90deg);"
        document.body.appendChild(upButton)
        upButton.addEventListener('click',(ev => {
            ev.preventDefault()
            if (this.onMove!==undefined)
                this.onMove.call(this.game, 1500, 0);
        }))

        const downButton = document.createElement("div");
        downButton.innerHTML = '>'
        downButton.style.cssText = "position:absolute;" +
            " bottom:20px;" +
            "font-size:30px;" +
            " background:rgba(126, 126, 126, 0.5);" +
            " border:#444 solid medium;" +
            " left:50%;" +
            " transform:translateX(-10px) rotate(90deg);"
        document.body.appendChild(downButton)
        downButton.addEventListener('click',(ev => {
            ev.preventDefault()
            if (this.onMove!==undefined)
                this.onMove.call(this.game, -1500, 0);
        }))
        this.onMove = options.onMove;
        this.game = options.game;

    }

}
