(function(){
    /* Generic ajax function */
    function ajax(opt, callback){
        if (opt.method == undefined){opt.method = 'GET'}
        if (opt.url == undefined){opt.url = ''}
        if (opt.data == undefined){opt.data = {}}
        opt.datastring = "";
        for (key in opt.data) {
            opt.datastring += key+'='+opt.data[key]+'&'
        }
        opt.datastring = opt.datastring.slice(0, -1);
        var request = new XMLHttpRequest();
        request.open(opt.method, opt.url, true);
        if (opt.method == 'POST'){
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                callback(this.response);
            } else {
                callback(this.response, {msg: 'Server did not return a good response code', status: this.status});
            }
        };
        request.onerror = function() {
            callback(this.response, {msg: 'Could probably not reach server', status: this.status});
        };
        request.send(opt.datastring);
    }

    /* The meat */
    if (document.querySelector('.dragsort tbody')) {
        dragula(
            [document.querySelector('.dragsort tbody')],
            {
                moves: function (el) {
                    return !!el.id;
                }
            }
        ).on('drop', function (el) {
            if (el.querySelector('.fa-align-left')) {
                var list = el.querySelector('.fa-align-left').classList;
                list.remove('fa-align-left');
                list.add('fa-spinner');
            }
            var sorting = {}
            var startingOn = document.querySelector('[data-showing-from]').dataset.showingFrom*1;
            Array.prototype.forEach.call(document.querySelectorAll('.dashboardlisting tbody tr[id]'), function(el, i){
                sorting[el.id] = startingOn + i;
                el.querySelector('.fa-align-left + a, .fa-spinner + a').innerHTML = el.querySelector('.fa-align-left + a, .fa-spinner + a').innerHTML.split(': ')[0] + ': ' + (startingOn + i);
            });
            ajax({
                method: 'POST',
                url: document.querySelector('[data-admin-path]').dataset.adminPath + '/dragsort',
                data: {sorting: JSON.stringify(sorting), contenttype: document.querySelector('[data-contenttype]').dataset.contenttype}
            }, function(response, err){
                if(err){
                    alert(err.msg);
                    return;
                }
                if (list) {
                    list.add('fa-align-left');
                    list.remove('fa-spinner');
                }
            });
        });
    }
})();
