const containerEl = $(".container");
const todayEl = $("#today");

var currentTimeEl;
let unformattedCurrentDay = dayjs();
let currentDay = dayjs().format("dd/MM/YYYY")
todayEl.text(dayjs().format("dddd D MMMM YYYY"));
const startHour = 6;
const endHour = 21;



function createTimeblocks(startingHour, endingHour){
    let trEl;
    let hourEl;
    let textareaEl;
    let buttonEl;
    for(i=startingHour; i<endingHour+1; i++){
        let time = i;
        trEl = $("<tr></tr>")
        .addClass("row")
        .attr("data-hour", time);
        hourEl = $("<td>")
        .addClass("hour")
        .css("width", "10%")
        .text(dayjs().hour(time).format("hA"));
        textareaEl = $("<td><textarea></textarea></td>")
        .addClass("textbox")
        .css("width", "80%");
        buttonEl = $("<button><td><i class='fa-solid fa-floppy-disk'></i></td></button>")
        .addClass("saveBtn")
        .css("width", "10%");
        containerEl.append(trEl);
        trEl.append(hourEl);
        trEl.append(textareaEl);
        trEl.append(buttonEl);
    }
}


const render = (daySelected) =>{ //Renders the page for the day selected
    console.log(dayjs(unformattedCurrentDay).isBefore(dayjs()));
    unformattedCurrentDay = daySelected;
    currentDay = dayjs(daySelected).format("dd/MM/YYYY");
    console.log(currentDay);
    todayEl.text(dayjs(daySelected).format("dddd D MMMM YYYY"));
    $(".container").html(""); //clears container element for re-rendering
    createTimeblocks(startHour,endHour);

    containerEl.children("tr").each(function (){
        if(dayjs(unformattedCurrentDay).date() == dayjs().date()){
        if(dayjs().hour() == $(this).data("hour")){
            $(this).addClass("present");
            currentTimeEl = $(this);
        }
        else if(dayjs().hour() > $(this).data("hour")) {
            $(this).addClass("past");
        }
        else{
            $(this).addClass("future");
        }
    }
    else if(dayjs(unformattedCurrentDay).isBefore(dayjs())){
        $(this).addClass("past");
    }
    else{
        $(this).addClass("future");
    }
        const planText = localStorage.getItem(`${$(this).data("hour")}_${currentDay}_Plan`);
        if( planText != "null"){
            $(this).children(".textbox").children().val(planText);
        }
    })
}

render(unformattedCurrentDay);

$("table").on("click", ".saveBtn" ,(event) => {
    event.preventDefault();
    //Weird work around as $(this) doesn't work in this case as element and parent element generated dynamically
    let button = event.target.closest("button"); //This ensures the button is selected even if the icon is clicked
    let textBox = $(button).parent().find(".textbox"); //finds the td textbox element, from there the textarea can be selected

    localStorage.setItem(`${($(button).parent().data("hour"))}_${currentDay}_Plan`,  $(textBox).children().val()); //Saves what is in the text area to local storage with the hour and day as the "key"
    console.log(`${($(button).parent().attr("data-hour"))}_${currentDay}_Plan`);
    console.log($(textBox).children().val());
})

$("#prev-button").on("click", (event) => { //Renders the day before the current selected day
    event.preventDefault();
    render(dayjs(unformattedCurrentDay).subtract(1, "day"));
} );

$("#next-button").on("click", (event) => { //Renders the next day from the current selected day
    event.preventDefault();
    render(dayjs(unformattedCurrentDay).add(1, "day"));
} );

$("#current-button").on("click", (event) => {//Renders the current day
    event.preventDefault();
    render(dayjs());
} )