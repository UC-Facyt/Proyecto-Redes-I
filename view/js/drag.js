(function () {
    const body = document.getElementsByTagName('body')[0];
    const modal = document.getElementById('dragomonster');

    body.ondragover = (e) => {
        modal.style.display = "block";
        return false;
    };

    body.ondragleave = (e) => false;
    body.ondragend = (e) => false;
    body.ondrop = () => false;

    modal.ondragover = (e) => {
        modal.style.display = "block";
        return false;
    };

    modal.ondragleave = (e) => {
        modal.style.display = "none";
        return false
    };

    modal.ondragend = (e) => false;

    modal.ondrop = (e) => {
        e.preventDefault();
        modal.style.display = "none";

        for (let f of e.dataTransfer.files) {
            console.log('File(s) you dragged here: ', f.path)
            console.log('File(s) name ',f.name)
        }
        return false;
    };
})();
