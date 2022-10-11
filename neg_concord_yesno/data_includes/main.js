PennController.ResetPrefix(null) // Shorten command names (keep this line here))

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

function Pick(set,n) {
    assert(set instanceof Object, "First argument of pick cannot be a plain string" );
    n = Number(n);
    if (isNaN(n) || n<0) 
        n = 0;
    this.args = [set];
    this.runSet = null;
    set.remainingSet = null;
    this.run = arrays => {
        if (this.runSet!==null) return this.runSet;
        const newArray = [];
        if (set.remainingSet===null) {
            if (set.runSet instanceof Array) set.remainingSet = [...set.runSet];
            else set.remainingSet = arrays[0];
        }
        for (let i = 0; i < n && set.remainingSet.length; i++)
            newArray.push( set.remainingSet.shift() );
        this.runSet = [...newArray];
        return newArray;
    }
}
function pick(set, n) { return new Pick(set,n); }


n_test_items = 20
n_filler_items = 13
test_pairids = Array(n_test_items).fill().map((element, index) => index + 1)
fillers_pairids = Array(n_filler_items).fill().map((element, index) => index + 25)

fisherYates(test_pairids);
fisherYates(fillers_pairids);

extr_items = test_pairids.slice(0, Math.ceil(n_test_items / 2))
good_fillers = fillers_pairids.slice(0, Math.ceil(n_filler_items / 2))

console.log(test_pairids)
console.log(extr_items)
console.log(fillers_pairids)
console.log(good_fillers)

// conditions = []
// for (let i = 1; i < 38; i++) {
    // conditions.push(pick(randomize(startsWith(i)), 1))
// }
// items = seq(...conditions.sort( () => Math.random() - 0.5 )) // shuffle,

// console.log(conditions)
// console.log(items)

var trial = row => newTrial("" + row.type,
        defaultTimer.log().start().wait()
        ,
        newTimer("break", 300)
            .start()
            .wait()
        ,
        // newText("context",row.context),
        // newText("context-item", row.context + "<br />" + "<b>" + row.item + "</b>"),
        newText("item", row.item).bold(),
        getText("item")
            .print("center at 50%", "center at 20%")
        ,
        newText("yes", "1. да").print("center at 50%", "center at 60%"),
        newText("no",  "0. нет").print("center at 50%", "center at 65%")
        ,
        newVar("RT").global().set( v=>Date.now() )
        ,
        newSelector("yes_no_choice")
            .add(getText("yes"), getText("no"))
            .keys("1", "0")
            .log()
                // .print()
                .wait()
        ,
        getVar("RT").set( v=>Date.now()-v )
    )
    .label([row.type, row.pair_id])
    .log("pair_id", row.pair_id)
    .log("item_id", row.item_id)
    .log("type",row.type)
    .log("compl", row.compl)
    .log("RT", getVar("RT"))


Sequence(
    "instructions",
    "context_practice_3",
    // "context_practice-yes_no-bad",
    shuffle(
		// seq(rshuffle("filler_good", "filler_bad")),
        seq(randomizeNoMoreThan(anyOf("filler_good", "filler_bad"), 2)),
		// seq(rshuffle("extraction", "no-extraction"))
        seq(randomizeNoMoreThan(anyOf("extraction", "no-extraction"), 3))
	),
    // items,
    // rshuffle("extraction", "no-extraction", "filler_bad", "filler_good"),
    // "extraction",
    // randomize(anyOf("extraction", "no-extraction", "filler_bad", "filler_good")),
    "send",
    "final"
);

Header( /* void */ )
    // This .log command will apply to all trials
    .log( "ID" , GetURLParameter("id") ) // Append the "ID" URL parameter to each result line

// Welcome screen and logging user's ID
newTrial( "instructions" ,
    // We will print all Text elements, horizontally centered
    defaultText.cssContainer({"margin-bottom":"1em", "text-align":"justify", "font-size":"medium"})
        .print()
    ,
    newText("instruction-welcome", "Спасибо за Ваш интерес к нашему лингвистическому эксперименту!\
                Участие в нем займёт около 10 минут.")
    ,
    newText("instruction-task", 'Вашей задачей будет оценить приемлемость предложений.\
                Если Вам кажется естественным услышать/увидеть или употребить такое предложение,\
                ставьте оценку 1 "да". Если же Вам кажется, что носитель русского языка так бы не сказал/не написал,\
                ставьте оценку 0 "нет".')
    ,
    newText("instruction-intuition", "При оценке ориентируйтесь на собственную интуицию носителя русского языка. Некоторые предложения лучше звучат, если читать их с определённой интонацией.")
    ,
    newText("instruction-info", "Укажите, пожалуйста, некоторую информацию о себе. Она будет использована нами\
                только в обобщённом виде для статистики, и не будет никому передаваться.")
    ,
    // newText("instruction-get-name", "Ваше имя, никнейм или инициалы:"
    //             + " <sup id=\"star\">*</sup>").center(),
    // newTextInput("PersonId")
    //     .center().print()
    // ,
    newText("instruction-get-lingedu", "Являетесь ли Вы лингвистом/учитесь ли Вы на лингвиста?"
                + " <sup id=\"star\">*</sup>").center(),
    newScale("PersonLinguist", "да", "нет")
        .labelsPosition("top")
        .center().print()
    ,
    newText("instruction-get-gender", "Ваш пол:"
                + " <sup id=\"star\">*</sup>").center(),
    newTextInput("PersonGender")
        .center().print()
    ,
    // newText("instruction-get-place", "В каком населенном пункте (в каких пунктах) Вы жили до 13 лет?"
    //             + " <sup id=\"star\">*</sup>").center(),
    // newTextInput("PersonPlace")
    //     .center().print()
    // ,
    newText("instruction-get-age", "Ваш возраст:"
                + " <sup id=\"star\">*</sup>").center(),
    newTextInput("PersonAge")
        .center().print()
    ,
    newTextInput("instruction-button-form-correctness", "Если кнопка ниже не срабатывает, проверьте,\
                пожалуйста, корректность введённых выше данных.")
    ,
    newText("instruction-thanks", "Спасибо, что помогаете нам и науке!")
    ,
    newText("instruction-contact-us", 'Если у Вас есть вопросы, напишите нам по почте\
                <a href="mailto:mobazhukov@edu.hse.ru?subject=Вопрос об исследовании">\
                mobazhukov@edu.hse.ru</a>')
    ,
    newText("instruction-button-form-correctness", "Если кнопка ниже не срабатывает, проверьте,\
                пожалуйста, корректность введённых выше данных.")
    ,
    newButton("instruction-consent", "Я соглашаюсь участвовать в эксперименте и подтверждаю,<br />\
                    что русский - мой родной язык.")
        .cssContainer({"margin-bottom":"3em", "font-size": "large"})
        .center().print()
        .wait(getTextInput("PersonAge").test.text(/^(?:1[0-9]|[2-9][0-9])$/)
            //   .and(getTextInput("PersonId").test.text(/^(?:\w+|[а-яА-Я]+| )+$/))
              .and(getTextInput("PersonGender").test.text(/^(?:\w+|[а-яА-Я]+| )+$/))
            //   .and(getTextInput("PersonPlace").test.text(/^(?:\w+(?:-|,)?|[а-яА-Я]+(?:-|,)?| )+$/))
              .and(getScale("PersonLinguist").test.selected())
            //   .and(getScale("PersonRussianOnly").test.selected())
            //   .and(getTextInput("PersonOtherLanguages").testNot.text(/^.+$/)
            //         .or(getTextInput("PersonOtherLanguages").test.text(/^(?:\w+(?:-|,)?|[а-яА-Я]+(?:-|,)?| )+$/))
            //   )
        )
    ,
    // newKey(" ").wait()  // Finish trial upon press on spacebar
    // newVar("PersonId").global()
    //     .set(getTextInput("PersonId"))
    // ,
    newVar("PersonGender").global()
        .set(getTextInput("PersonGender"))
    ,
    // newVar("PersonPlace").global()
    //     .set(getTextInput("PersonPlace"))
    // ,
    newVar("PersonAge").global()
        .set(getTextInput("PersonAge"))
    ,
    newVar("PersonLinguist").global()
        .set(getScale("PersonLinguist"))
    // ,
    // newVar("PersonRussianOnly").global()
    //     .set(getScale("PersonRussianOnly"))
    // ,
    // newVar("PersonOtherLanguages").global()
    //     .set(getTextInput("PersonOtherLanguages"))
)
    .setOption("hideProgressBar",true)
    // .log("PersonId", getVar("PersonId"))
    .log("PersonGender", getVar("PersonGender"))
    // .log("PersonPlace", getVar("PersonPlace"))
    .log("PersonAge", getVar("PersonAge"))
    .log("PersonLinguist", getVar("PersonLinguist"))
    // .log("PersonRussianOnly", getVar("PersonRussianOnly"))
    // .log("PersonOtherLanguages", getVar("PersonOtherLanguages"))
    .log("Square", GetURLParameter("withsquare"))


newTrial("context_practice_3",
    defaultText.print()
    ,
    // Automatically start and wait for Timer elements when created, and log those events
    defaultTimer.log().start().wait()
    ,
    newText("item", "Вчера у Маши машина сломалась, что теперь никуда ездить не может")
        .bold()
        .print("center at 50%", "center at 30%")
    ,
    newText("yes", "1. да").print("center at 50%", "center at 60%"),
    newText("no",  "0. нет").print("center at 50%", "center at 65%")
    ,
    newTooltip("guide", "Оцените это предложение <br />\
                    как 1, если так сказать можно,<br />\
                    или 0, если так сказать нельзя")
        .position("bottom center")  // Display it below the element it attaches to
        .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
        .print(getText("item"))   // Attach to the "target" Text element
    ,
    newSelector("yes_no_choice")
        .add(getText("yes"), getText("no"))
        .keys("1", "0")
        .log()
            .wait()
            .test.selected("yes")
                .success(getTooltip("guide").text(
                "<p>Верно, это предложение хорошее, хотя и разговорное, <br />\
                   и должно быть оценено как приемлемое (1)</p>"))
            .failure(getTooltip("guide").text(
            "<p>Можно оценить предложение как приемлемое (1), потому что<br />\
                        это предложение хорошее, хотя и разговорное</p>"))
    ,
    newButton("continue", "Продолжить")
        .cssContainer({"transform": "scale(1.8)"})
        .center().print("center at 50%", "center at 92%")
        .wait()
    // ,
    // getText("test").remove()          // End of trial, remove "target"
);


// // "Если я придёт вовремя, то меня не будут ругать"


Template(
    GetTable("examples_new.csv")
        .filter(row => row.type === 'extraction' && extr_items.indexOf(Number(row.pair_id)) > -1)
    ,
    // row => newTrial("" + row.pair_id + "-" + row.type,
    trial
);

Template(
    GetTable("examples_new.csv")
        .filter(row => row.type === 'no-extraction' && extr_items.indexOf(Number(row.pair_id)) === -1)
    ,
    // row => newTrial("" + row.pair_id + "-" + row.type,
    trial
);

Template(
    GetTable("examples_new.csv")
        .filter(row => row.type === 'filler_good' && good_fillers.indexOf(Number(row.pair_id)) > -1)
    ,
    // row => newTrial("" + row.pair_id + "-" + row.type,
    trial
);

Template(
    GetTable("examples_new.csv")
        .filter(row => row.type === 'filler_bad' && good_fillers.indexOf(Number(row.pair_id)) === -1)
    ,
    // row => newTrial("" + row.pair_id + "-" + row.type,
    trial
);

// Send the results
SendResults("send");

// A simple final screen
newTrial("final" ,
    newText("Эксперимент закончен. Спасибо Вам за участие!")
        .print()
    ,
    newText("Вы можете закрыть страницу.")
        .print()
    ,
    newText('Если у Вас есть вопросы или Вы хотите,\
                чтобы мы рассказали Вам о цели и результатах эксперимента\
                по завершении исследования, напишите нам по почте\
                <a href="mailto:mobazhukov@edu.hse.ru?subject=Вопрос об исследовании">\
                mobazhukov@edu.hse.ru</a>')
        .print()
    ,
    // Stay on this page forever
    newButton().wait()
)
    .setOption("countsForProgressBar",false);