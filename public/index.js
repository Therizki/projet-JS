const form = document.querySelector(".form-events");
var monBool=null;

var selectedRow = null
//Evenement
//
function ClearFields(){
    document.querySelector('#fnom').value=""
     document.querySelector('#flieu').value=""
    document.querySelector('#fmaximal').value=""
  
    document.querySelector('#fdateEvent').value=""
    document.querySelector('#fDelai').value=""
    document.querySelector('#fheurDepart').value=""
    document.querySelector('#fheurFinir').value=""

}
function showAllert(message, className){
    const div = document.createElement("div")
    div.className = `alert alers-${className} role ="alert"` 
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const main = document.querySelector('.main')
    container.insertBefore(div,main)
    setTimeout(()=>document.querySelector(".alert").remove(),3000)
    
}
form.addEventListener('submit',async (e)=>{
    monBool=null
    e.preventDefault();
    const nom = document.querySelector('#fnom').value;
    const lieu = document.querySelector('#flieu').value;
    const maximal = document.querySelector('#fmaximal').value;
    const dateEvent = document.querySelector('#fdateEvent').value;
    const Delai = document.querySelector('#fDelai').value;
    let heurDepart = document.querySelector('#fheurDepart').value;
    let heurFinir = document.querySelector('#fheurFinir').value;
    if(nom == "" || lieu =="" ||maximal==null || dateEvent==""||Delai=="" || heurDepart==""
    || heurFinir=="" ){
        showAllert("veuillez remplir tous les case","danger")
        return;
    }
    let  timeArray = heurDepart.split(":");
    let HH = parseInt(timeArray[0]);
    let mm = parseInt(timeArray[1]);
     if(HH>=24){
        showAllert("veuillez entrer des heurs valides","danger")
        return;
     }
     if(mm>=60){
        showAllert("veuillez entrer des heurs valides","danger")
        return;
     }
     heurDepartTemp = HH*24+60;
    timeArray = heurFinir.split(":");
     HH = parseInt(timeArray[0]);
     mm = parseInt(timeArray[1]);
     if(HH>=24){
        showAllert("veuillez entrer des heurs valides","danger")
        return;
     }
     if(mm>=60){
        showAllert("veuillez entrer des heurs valides","danger")
        return;
     }
      heurFinirTemp = HH*24+60;
    if(heurDepartTemp > heurFinirTemp  ){
        showAllert("veuillez entrer des heurs valides","danger")
        return;
    }else{
        console.log("done heur")
    }
fetch("http://localhost:3000/api", {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json',
   },
   body: JSON.stringify({
      name: nom,
      lieu: lieu,
      nombreMaximal: maximal,
      Delai:Delai,
     DateEvent:dateEvent,
    heurDepart:heurDepart,
    heurFinition:heurFinir
   })
}).then(result=>{   
     monBool = result.status;
     console.log(1,monBool)
     console.log(2,monBool)
    if(monBool!=200){
        return;
    }
    if(selectedRow==null){
        console.log("je suis ici ")
        const list = document.querySelector(".event-list");
        const row = document.createElement("tr");
            row.innerHTML= `
            <td>${nom}</td>
            <td>${lieu}</td>
            <td>${dateEvent}</td>
            <td>${maximal}</td>
            <td>${Delai}</td>
            <td>${heurDepart}</td>
            <td>${heurFinir}</td>
            <td>
            <button type="button" class="btn btn-primary edit">modifier</button>
            <button type="button" class="btn btn-danger delete">Supprimer</button>
             `
             list.appendChild(row);
             selectedRow= null;
           showAllert("Evenement cree","success");
         
    }else{
        if(monBool==200){
        selectedRow.children[0].textContent=nom
        selectedRow.children[1].textContent=lieu
        selectedRow.children[2].textContent=maximal
        selectedRow.children[3].textContent=dateEvent
        selectedRow.children[4].textContent=Delai
        selectedRow.children[5].textContent=heurDepart
        selectedRow.children[6].textContent=heurFinir
        selectedRow = null
        showAllert("l'evenement a été modifié")
        }else{
            showAllert("l'evenement n a été pas modifié")
            monBool=null;
        }
    }
   ClearFields();
})
    
    })


form.addEventListener('submit',async (e)=>{
    fetch("http://localhost:3000/api", {
      method: 'get',
         headers: {
      'Content-Type': 'application/json',
     }
    }).then(result=>{   
        console.log(2,JSON.stringify(result))
       if(monBool!=200){
           return;
       }
    })
    })
document.querySelector(".event-list").addEventListener("click",(e)=>{
    target = e.target;
    if(target.classList.contains("edit")){
        selectedRow = target.parentElement.parentElement;
        document.querySelector('#fnom').value=selectedRow.children[0].textContent
        document.querySelector('#flieu').value= selectedRow.children[1].textContent
        document.querySelector('#fmaximal').value=selectedRow.children[2].textContent
        document.querySelector('#fdateEvent').value=selectedRow.children[3].textContent
        document.querySelector('#fDelai').value=selectedRow.children[4].textContent
        document.querySelector('#fheurDepart').value=selectedRow.children[5].textContent
        document.querySelector('#fheurFinir').value=selectedRow.children[6].textContent
    }
})

document.querySelector(".event-list").addEventListener("click",(e)=>{
    target = e.target;
    if(target.classList.contains("delete")){
        selectedRow = target.parentElement.parentElement.remove();
        showAllert("L'evenement a ete supprimé","danger")
    }
})