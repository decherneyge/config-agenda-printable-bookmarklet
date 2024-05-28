//get all the selected sessions by selecting all the remove session buttons and then getting the closest agenda or keynote section
let selectedSessions = [ ...document.querySelectorAll('[data-type="remove_session"]')]
    .map((b)=>b.closest('.js-agenda-section,.js-keynote-section'));

const sessionDay = (session) => {
    if(!session) return 'Unknown Day';

    if(session.classList.contains('agenda-2cc7f9fad51d')) return document.querySelector('[for="agenda-2cc7f9fad51d"]').innerText.trim();
    if(session.classList.contains('agenda-30981362f7c6')) return document.querySelector('[for="agenda-30981362f7c6"]').innerText.trim();
    return 'Unknown Day';
}
let selectedSessionsData = selectedSessions.map((s)=> {
    if(!s) return s;
    return {
        date:sessionDay(s),
        time:s.querySelector('.bigmarker-cg-agenda-card-time,.bigmarker-cg-keynote-time').innerText.trim(),
        title:(s.querySelector('.bigmarker-cg-agenda-card-titletime a,.bigmarker-cg-keynote-title-box a,.bigmarker-cg-keynote-more-title-box a')??{innerText:'cant find'}).innerText.trim()
    };
});

// create a style element with id agenda-print-styles and insert it into the head
// if the style element already exists then remove it
let printStyleElement = document.querySelector('#agenda-print-styles');
if(printStyleElement){
    document.head.removeChild(printStyleElement);
}
printStyleElement = document.createElement('style');
printStyleElement.id = 'agenda-print-styles';
printStyleElement.innerHTML = `
    .js-print-dl {
        display: none;
    }
    @media print {
        .js-agenda-list {
            display: none;
        }
        .js-print-dl {
            display: block;
        }
        .js-print-dt-date {
            
            margin-top: 1em;
        }
        .js-print-dl dt {
            margin-top: 1em;
        }
        .js-print-dl dd {
            font-weight: bold;
            margin-left: 1em;
        }
    }
`;

document.head.appendChild(printStyleElement);

let printDlElement = document.querySelector('.js-print-dl');
if(printDlElement){
    document.body.removeChild(printDlElement);
}
printDlElement = document.createElement('dl');
printDlElement.classList.add('js-print-dl');
selectedSessionsData.forEach((s,i,a)=>{
    //check the date property of the session object, if it is not the same as the previous session object then add a new dt element with the date
    if(i===0 || (i > 0 && a[i-1].date !== s.date)){
        let dt = document.createElement('dt');
        dt.innerText = s.date;
        dt.classList.add('js-print-dt-date');
        let dd = document.createElement('dd');
        dd.appendChild(document.createElement('hr'));
        printDlElement.appendChild(dt);
        printDlElement.appendChild(dd);
    }
    let dt = document.createElement('dt');
    dt.innerText = s.time;
    let dd = document.createElement('dd');
    dd.innerText = s.title;
    printDlElement.appendChild(dt);
    printDlElement.appendChild(dd);
});
document.body.appendChild(printDlElement);