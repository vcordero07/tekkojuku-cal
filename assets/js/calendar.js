// $(document).ready((e) => {
//   renderCalendarMonthYear(10, 2017);
// })
//
// /***
//  * RENDERS CALENDAR IN DOM DISPLAY FOR REQUESTED MONTH AND YEAR
//  * @param  {int} month (int-1) THE MONTH REQUESTED
//  * --
//  * @return {int} THE YEAR REQUESTED
//  ***/
// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//   days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//
// function renderCalendarMonthYear(month, year) {
//   let reqDate = new Date(year, month, 1),
//     reqMonth = reqDate.getMonth(),
//     reqTotDays = new Date(year, month, 0).getDate(),
//     startDay = new Date(year, month, 1);
//   startDay = String(startDay).match(/^\w*/g);
//   startDay = startDay[0];
//   qonsole.debug('startDay', startDay);
//
//   let pseudoObj = [ //mocked results from database - ASSUMING results have been filtered and sorted
//       {
//         _id: '3newionanonoa',
//         content: 'it is a calendar',
//         dateOccurrence: new Date(2017, 1, 28).getTime()
//       }
//     ],
//     pseudoObjPos = 0;
//
//   $('#calendar').attr('data-curmonth', month).attr('data-curyear', year);
//   $('#calendar').html(`<h3>${months[month-1]} ${year}</h3>`)
//   for (var h = 0; h < days.length; h++) {
//     if (days[h] === startDay) {
//       break;
//     }
//     $('#calendar').append(`<div class="calendar-day" data-event-id="">
//                                   <i data-epoch-date=""></i>
//                                   <span></span>
//                               </div>`);
//   }
//   for (var i = 0; i < reqTotDays; i++) {
//     let epochDate = new Date(year, month - 1, (i + 1)).getTime();
//     curContent = {
//       _id: '',
//       content: ''
//     };
//     if (pseudoObj[0] && pseudoObj[0].dateOccurrence === epochDate) {
//       curContent = pseudoObj.shift();
//     }
//     qonsole.debug('runnning');
//     $('#calendar').append(
//       `<div class="calendar-day" data-event-id="${curContent._id}">
//                                   <i data-epoch-date="${epochDate}">${i+1}</i>
//                                   <span>${curContent.content}</span>
//                               </div>`
//     )
//   }
//   qonsole.debug('reqDate,reqMonth,reqTotDays:', reqDate, reqMonth, reqTotDays);
//   setListeners();
// }
//
// function setListeners() {
//   let listens = {
//     click: [{
//         element: '.calendar-day, #calendar-modal-cancel',
//         action: selectDay
//       },
//       {
//         element: '#prev-month,#next-month',
//         action: cycleMonth
//       }
//     ],
//     submit: [{
//       element: '#calendar-modal-form',
//       action: submitCalendarForm
//     }]
//   }
//
//   //Click Listeners:
//   for (let i = 0; i < listens.click.length; i++) {
//     $(listens.click[i].element).off();
//     $(listens.click[i].element).click(function() {
//       listens.click[i].action($(this))
//     })
//   }
//
//   //Submit Listeners:
//   for (let j = 0; j < listens.submit.length; j++) {
//     $(listens.submit[j].element).off();
//     $(listens.submit[j].element).submit(function(e) {
//       e.preventDefault();
//       listens.submit[j].action($(this).serialize());
//     })
//   }
//
// }
//
// function cycleMonth(obj) {
//   let newMonth = parseInt($('#calendar').attr('data-curmonth')) + parseInt($(obj[0]).attr('data-offset')),
//     newYear = parseInt($('#calendar').attr('data-curyear'));
//   qonsole.debug('obj[0]:', $(obj[0]).attr('data-offset'));
//   if (newMonth >= 11) {
//     newMonth = 0;
//     newYear++;
//   }
//   if (newMonth < 0) {
//     newMonth = 11;
//     newYear--;
//   }
//   renderCalendarMonthYear(newMonth, newYear);
// }
//
// function selectDay(obj) {
//   // openModal(selectedDate);
//   qonsole.debug('open the modal, pass in the date being used', $(obj[0]).find('i').text(), $(obj[0]).find('span').text());
//
//   $('#calendar-event-modal').toggle();
//   $('#calendar-event-modal #calendar-modal-form [name="date"]').val($(obj[0]).find('i').attr('data-epoch-date'));
//   $('#calendar-event-modal #calendar-modal-form [name="content"]').val($(obj[0]).find('span').text());
// }
//
// function submitCalendarForm(obj) {
//   qonsole.debug('submitting to endpoint:', obj);
//   $.ajax({ method: 'POST', data: obj, url: `${BASE_URL}calendar` })
// }
