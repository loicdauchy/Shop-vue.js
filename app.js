fetch('http://127.0.0.1:8000/api/liste')
.then(res => {
    if(res.ok){
        res.json().then(data => {               
fetch('http://127.0.0.1:8000/api/categoryListe')
.then(resp => {
    if(resp.ok){
        resp.json().then(cateData => {

            for(var i = 0; i < data.length; i++){
                data[i].newPrice = data[i].price;
                data[i].qty = 1;
            }
                       
            console.log(cateData)
            console.log(data)
            var app = new Vue({
                el: "#content",
                data: {
                    search: '',
                    priceSearch: '',
                    categorySearch: '',
                    articles: data,
                    categories: cateData,
                    url: "http://127.0.0.1:8000",
                    commandes: [],
                    totalPrice: 0,
                    details: '',
                    cmdLength: 0,
                    show: false,
                    cb: false
                    
                },
                computed: {
                    filteredArticle(){
                        return this.articles.filter(article => article.title.toLowerCase().includes(this.search.toLowerCase()));
                    },
                    filteredPrice(){
                        if(this.priceSearch == "10"){
                            return this.articles.filter(article => article.price < 10);
                        }else if(this.priceSearch == "50"){
                            return this.articles.filter(article => article.price > 10 && article.price <= 50);
                        }else if(this.priceSearch == "51"){
                            return this.articles.filter(article => article.price > 50 && article.price <= 100);
                        }else if(this.priceSearch == "101"){
                            return this.articles.filter(article => article.price > 100);
                        }else if(this.priceSearch == ""){
                            
                        }
                    },
                    filteredCategory(){
                        return this.articles.filter(article => article.category.title == this.categorySearch );
                    },
                    filteredCumulate(){
                        if(this.priceSearch == "10" && this.categorySearch != ""){
                            return this.articles.filter(article => article.price < 10 && article.category.title == this.categorySearch);
                        }else if(this.priceSearch == "50" && this.categorySearch != ""){
                            return this.articles.filter(article => article.price > 10 && article.price <= 50 && article.category.title == this.categorySearch);
                        }else if(this.priceSearch == "51" && this.categorySearch != ""){
                            return this.articles.filter(article => article.price > 50 && article.price <= 100 && article.category.title == this.categorySearch);
                        }else if(this.priceSearch == "101" && this.categorySearch != ""){
                            return this.articles.filter(article => article.price > 100 && article.category.title == this.categorySearch);
                        }else if(this.priceSearch == ""){
                            
                        }
                    }           
                },
                methods: {
                    setLocal: function(){
                        var newCommand = JSON.stringify(this.commandes);                      
                        localStorage.setItem('localCommandes', newCommand);
                        localStorage.setItem('tPrice', this.totalPrice);  
                        localStorage.setItem('cmdLength', this.cmdLength);     
                                                                 
                    },
                    commander: function(article){
                        this.commandes.push(article);
                        this.totalPrice += article.price;
                        console.log(typeof this.totalPrice)
                        this.cmdLength++;
                        document.getElementById(article.id).classList.add('validateClick');
                        setTimeout(function(){
                        document.getElementById(article.id).classList.remove('validateClick');
                        }, 1000);                       
                        this.setLocal();                   
                    },
                    ajouter: function(article){
                        article.qty++;
                        article.newPrice = article.price * article.qty;
                        this.totalPrice += article.price;
                        this.cmdLength++;
                        this.setLocal();
                    },
                    soustraire: function(article){
                        if(article.qty < 2){
                            var pos = this.commandes.indexOf(article);
                            this.commandes.splice(pos, 1);                 
                            this.totalPrice -= article.price;
                            this.cmdLength--;
                            this.setLocal();
                        }else{
                            article.qty--;
                            article.newPrice = article.price * article.qty;
                            this.totalPrice -= article.price;
                            this.cmdLength--;
                            this.setLocal();
                        }
                        
                    },
                    retirer: function(article){
                        var pos = this.commandes.indexOf(article);
                        this.commandes.splice(pos, 1);                 
                        this.totalPrice -= (article.price * article.qty);
                        this.cmdLength-= article.qty;
                        this.setLocal();
                    },
                    makeDetails: function(article){
                        var pos = this.articles.indexOf(article);
                        this.details = data[pos];
                    }
                }
            })
            function getLocalData() {
                if(localStorage.length > 0){
                    var newArray = JSON.parse(localStorage.getItem("localCommandes"));
                    var newArrayLength = newArray.length;
                    for(var i = 0; i < newArrayLength; i++){
                        app.commandes.push(newArray[i]);         
                    }
                    app.totalPrice = parseInt(localStorage.getItem("tPrice")); 
                    app.cmdLength =  localStorage.getItem("cmdLength");
                }
                        
            }

            getLocalData();

            document.getElementById('btnCommand').addEventListener('click', function(){
                document.getElementById('btnCommand').classList.add('none');
                document.getElementById('btnCommandNext').classList.add('block');
            })

            document.getElementById('btnCommandNext').addEventListener('click', function(){
                var info = {
                    nom: document.getElementById('nom').value,
                    mail: document.getElementById('mail').value,
                    adress: document.getElementById('adress').value,
                    num: document.getElementById('num').value
                };

                var infos = JSON.stringify(info);                      
                localStorage.setItem('infos', infos);


                document.getElementById('info').classList.add('none');
                document.getElementById('btnCommandNext').classList.add('none');
                document.getElementById('btnCommandFinal').classList.add('block');
            })

            document.getElementById('btnCommandFinal').addEventListener('click', function(){
                var infoPay = {
                    titulaire: document.getElementById('titulaire').value,
                    CB: document.getElementById('numCB').value,
                    validité: document.getElementById('fdv').value,
                    Crypto: document.getElementById('crypto').value
                };

                var infosPay = JSON.stringify(infoPay);                      
                localStorage.setItem('infosPay', infosPay);


                setTimeout(function(){
                    var infos = JSON.parse(localStorage.getItem("infos"));
                    var infosPay = JSON.parse(localStorage.getItem("infosPay"));
                    var articles = JSON.parse(localStorage.getItem("localCommandes"));
                    for(var i = 0; i < articles.length; i++){
                    var price = articles[i].price * articles[i].qty;
                    var now = new Date();                   
                    var mois    = now.getMonth() + 1;
                    var jour    = now.getDate();
                    var heure   = now.getHours();
                    var minute  = now.getMinutes();
                    var annee   = now.getFullYear();
                    var commandeDate = "Le "+jour+"/"+mois+"/"+annee+" à "+heure+"h"+minute;
                    
                    var commande = {
                        nom: infos.nom,
                        mail: infos.mail,
                        tel: infos.num,
                        adress: infos.adress,
                        titulaire: infosPay.titulaire,
                        cb: infosPay.CB,
                        fdv: infosPay.validité,
                        crypto: infosPay.Crypto,
                        ida: articles[i].id.toString(),
                        titlea: articles[i].title,
                        qtya: articles[i].qty.toString(),
                        price: price.toString(),
                        date: commandeDate
                    }
                        var Ncommande = JSON.stringify(commande);
                        let xmlhttp = new XMLHttpRequest()
                    
                        
                        xmlhttp.open("POST", "http://127.0.0.1:8000/apip/commandes")   
                        xmlhttp.setRequestHeader("Content-Type", "application/json");               
                        xmlhttp.send(Ncommande)
                    }               
                },100)


                document.getElementById('infoCB').classList.add('none');
                document.getElementById('alertSuccess').classList.add('block');
                document.getElementById('btnCommandFinal').classList.remove('block');
                setTimeout(function(){
                    localStorage.clear();
                    window.location.reload();
                },10000)
            })
           

        })
    }else{
        console.log('Erreur');
    }
})

})
}else{
    console.log('Erreur');
}
})

