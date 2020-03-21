const yeniFilm = document.getElementById('yeni-film'); 
const isim=document.getElementById('film-isim');
const yonetmen = document.getElementById('yonetmen');
const puan = document.getElementById('puan');
const buton = document.getElementById('buton');
const filmListesi = document.getElementById('liste');
const row = document.getElementById('row')
const deger = document.getElementById('deger');

class Movie{
    constructor(isim, yonetmen,puan){
        this.isim = isim.value;
        this.yonetmen = yonetmen.value;
        this.puan = puan.value;
        this.sinemaId = Math.floor(Math.random()*100000);
    }
}

class UI{
    filmEkle(sinema){
        let html = `
            <tr>
                <td class="font-weight-bold" >${sinema.isim}</td>
                <td class="font-weight-bold" >${sinema.yonetmen}</td>
                <td class="font-weight-bold" >${sinema.puan}</td>
                <td>
                    <a href="#" data-id="${sinema.sinemaId}" class="btn btn-warning btn-sm font-weight-bold ciz">ciz</a>
                    <a href="#" data-id="${sinema.sinemaId}" class="btn btn-danger btn-sm font-weight-bold delete">sil</a>
                    <a href="#" data-id="${sinema.sinemaId}" class="btn btn-success btn-sm font-weight-bold edit">edit</a>
                </td>
            </tr>
        `;
        filmListesi.innerHTML += html
    }

    showAlert(uyari, className){
        let alert = `
            <div id="alert" class="alert alert-${className}">${uyari}</div>
        `
        row.insertAdjacentHTML('afterend', alert);

        setTimeout(() => {
            document.getElementById('alert').remove()
        }, 2000);
    }
    temizle(){
        isim.value= '';
        yonetmen.value= '';
        // puan.value= '';
        puan.value = 0;
        deger.value = 0
    }
    sil(e){
        if(e.classList.contains('delete')){
            e.parentElement.parentElement.remove();
            return true;
        }
    }
    edit(e){
        if(e.classList.contains('edit')){
            // console.log('edit');
            let kategoriAlani = e.parentElement.parentElement.firstElementChild.innerHTML;
            let isAlani = e.parentElement.parentElement.firstElementChild.nextElementSibling.innerHTML;
            let onemAlani = e.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;

            console.log(kategoriAlani, isAlani, onemAlani);
            console.log(e.parentElement.parentElement);

            isim.value =  kategoriAlani;
            yonetmen.value =  isAlani;
            puan.value =  onemAlani;

            console.log(Storage.filmleriGetir())

            e.parentElement.parentElement.classList.toggle('bg-primary')
            buton.innerText = 'kaydet'
            buton.classList.add('bg-primary')
            e.parentElement.parentElement.remove();
            Storage.filmSilStorage(e);                
            return true;            
        }
    }
    ciz(e){
        if(e.classList.contains('ciz')){
            console.log('ciz')
            e.parentElement.parentElement.classList.toggle('bg-dark')
            e.parentElement.parentElement.classList.toggle('text-muted')
            return true;
        }
    }
}

class Storage{
    
    static filmleriGetir(){
        let filmler;
        if(localStorage.getItem('filmler') === null){
            filmler = [];
        } else {
            filmler = JSON.parse(localStorage.getItem('filmler'))
        }
        return filmler;
    }
    
    static filmleriGoster(){
        const filmler = Storage.filmleriGetir();
        filmler.forEach(x => {
            const arayuz = new UI();
            arayuz.filmEkle(x)
        });
    }
    static filmEkleStorage(film){
        const filmler = Storage.filmleriGetir();
        filmler.push(film);
        localStorage.setItem('filmler', JSON.stringify(filmler));
    }
    
    static filmSilStorage(ex){
        // if(ex.classList.contains('delete')){
        if(ex.classList.contains('delete') || ex.classList.contains('edit')){
            const id = ex.getAttribute('data-id');
            const filmlerStorage = Storage.filmleriGetir();
            filmlerStorage.forEach((x,index) => {
                if(x.sinemaId == id){
                    filmlerStorage.splice(index,1);
                }
            });
            localStorage.setItem('filmler', JSON.stringify(filmlerStorage))
        }
    }
}

document.addEventListener('DOMContentLoaded', Storage.filmleriGoster)


function filmOlustur(e){
    e.preventDefault();
    console.log(isim.value);
    
    const sinema = new Movie(isim, yonetmen, puan);
    const arayuz = new UI();
    
    if(isim.value === '' || yonetmen.value === '' || puan.value === ''){
        arayuz.showAlert('butun alanları doldurun', 'danger');
    } else {
        arayuz.filmEkle(sinema);
        arayuz.temizle();
        Storage.filmEkleStorage(sinema)
    }
    
}

function filmSil(e){
    const arayuz = new UI();
    if(arayuz.sil(e.target) == true){
        arayuz.showAlert('film silindi', 'danger');
        Storage.filmSilStorage(e.target);
    };
}
function filmEdit(e){
    const arayuz = new UI();
    if(arayuz.edit(e.target) == true){
        arayuz.showAlert('editlendi', 'danger');
        // Storage.filmSilStorage(e.target);
    };
}
function filmCiz(e){
    const arayuz = new UI();
    if(arayuz.ciz(e.target) == true){
        arayuz.showAlert('cizildi', 'warning');
        // Storage.filmSilStorage(e.target);
    };
}

function degerGoster(puan){
    deger.innerHTML = puan;    
}

yeniFilm.addEventListener('submit', filmOlustur);

filmListesi.addEventListener('click', filmSil);
filmListesi.addEventListener('click', filmEdit);
filmListesi.addEventListener('click', filmCiz);










