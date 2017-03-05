(function () {
        var holder = document.getElementById('dragon');
        var holder1 = document.getElementById('dragomonster');

        holder.ondragover = (e) => {
            var modal = document.getElementById('dragomonster');
            modal.style.display = "block";
            return false;
        };

        holder.ondragleave = (e) => {
            return false
        };

        holder.ondragend = (e) => {
            return false;
        };

        holder.ondrop = () => {
            return false;
        };

        holder1.ondragover = (e) => {
            var modal = document.getElementById('dragomonster');
            modal.style.display = "block";
            return false;
        };

        holder1.ondragleave = (e) => {
            var modal = document.getElementById('dragomonster');
            modal.style.display = "none";
            return false
        };

        holder1.ondragend = (e) => {
            return false;
        };

        holder1.ondrop = (e) => {
            e.preventDefault();
            var modal = document.getElementById('dragomonster');
            modal.style.display = "none";

            for (let f of e.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.path)
                console.log('File(s) name ',f.name)
            }
            return false;
        };
    })();
