PennController.ResetPrefix(null) // Shorten command names (keep this line here))

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment




Sequence(
    "instructions",
    // "context_practice", 
    // "context_practice_2",
    "context_practice-forced",
    // shuffle(
		// // seq(rshuffle("filler_good", "filler_bad")),
        // seq(randomizeNoMoreThan("filler", 2)),
		// // seq(rshuffle("extraction", "no-extraction"))
        // seq(randomizeNoMoreThan("extraction", 2))
        // // seq(randomizeNoMoreThan(anyOf(endswith("extraction"), endsWith("filler")), 2))
    // // randomizeNoMoreThan(anyOf(endswith("-extraction"), endsWith("-filler")), 2)
	// ),
    rshuffle("extraction", "filler"),
    "send", "final"
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
                Участие в нем займёт около 5 минут.")
    ,
    newText("instruction-task", "Вашей задачей будет выбрать более приемлемое из двух предложений.\
                Выбирайте такое предложение, которое по Вашему мнению, естественнее\
                услышать/увидеть или употребить, чем другое.\
                Важно оценивать предложения именно в сравнении друг с другом.")
    ,
    newText("instruction-intuition", "При оценке ориентируйтесь на собственную интуицию носителя русского языка. Некоторые предложения лучше звучат, если читать их с определённой интонацией.")
    ,
    newText("instruction-keys", "Оценки следует ставить, <b>нажимая цифры на клавиатуре</b> компьютера."),
    newText("instruction-info", "Укажите, пожалуйста, некоторую информацию о себе. Она будет использована нами\
                только в обобщённом виде для статистики, и не будет никому передаваться.")
    ,
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
    // newText("instruction-get-other-languages", "Русский язык является вашим единственным родным языком?" 
    //             + " <sup id=\"star\">*</sup>").center(),
    // newScale("PersonRussianOnly", "да", "нет")
    //     .labelsPosition("top")
    //     .center().print()
    // ,
    // newText("instruction-get-other-languages=", "Укажите эти другие языки при желании:").center(),
    // newTextInput("PersonOtherLanguages")
    //     .center().print()
    // ,
    // newTextInput("PersonOtherLanguages").center(),
    // getScale("PersonRussianOnly").test.selected("да")
    //     .success(newText("instruction-optional-get-languages",
    //                 "при желании, укажите эти языки").center())
    // ,
    // getScale("PersonRussianOnly").test.selected("да")
    //     .success(getTextInput("PersonOtherLanguages"))
    // , 
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


newTrial("context_practice" ,
    defaultText.print()
    ,
    // Automatically start and wait for Timer elements when created, and log those events
    defaultTimer.log().start().wait()
    ,
    newText("test", "Если я придёт вовремя, то меня не будут ругать")
        .bold()
        .print("center at 50%", "center at 30%")
    ,
    newTooltip("guide", "Оцените это предложение от 1 до 5, <br />\
                    где 1 - неприемлемое предложение,<br />\
                    а 5 - полностью приемлемое")
        .position("bottom center")  // Display it below the element it attaches to
        .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
        .print(getText("test"))   // Attach to the "target" Text element
    ,
    newScale("score", 5)
        .center()
        .labelsPosition("top")
        .keys()
        .log()
          .print("center at 50%", "center at 80%")
          .wait().test.selected(1)
            .or(getScale("score").test.selected(2))
          .success(getTooltip("guide").text("<p>Верно, это предложение плохое<br />\
                    и должно быть оценено на 1-2</p>") )
          .failure(getTooltip("guide").text("<p>Следует оценить на 1 или 2, потому что<br />\
                    это предложение совсем плохое (неверно 'я придЁТ') </p>") )
    ,
    newButton("continue", "Продолжить")
        .cssContainer({"transform": "scale(1.8)"})
        .center().print("center at 50%", "center at 92%")
        .wait()
    ,
    getText("test").remove()          // End of trial, remove "target"
)

// newTrial("context_practice_2" ,
//     defaultText.print()
//     ,
//     // Automatically start and wait for Timer elements when created, and log those events
//     defaultTimer.log().start().wait()
//     ,
//     newText("test", "Вчера у Маши машина сломалась, что теперь никуда ездить не может")
//         .bold()
//         .print("center at 50%", "center at 30%")
//     ,
//     newTooltip("guide", "Оцените это предложение от 1 до 5, <br />\
//                     где 1 - неприемлемое предложение,<br />\
//                     а 5 - полностью приемлемое")
//         .position("bottom center")  // Display it below the element it attaches to
//         .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
//         .print(getText("test"))   // Attach to the "target" Text element
//     ,
//     newScale("score", 5)
//         .center()
//         .labelsPosition("top")
//         .keys()
//         .log()
//           .print("center at 50%", "center at 80%")
//           .wait().test.selected(5)
//             .or(getScale("score").test.selected(4))
//             .or(getScale("score").test.selected(3))
//           .success(getTooltip("guide").text("<p>Верно, это предложение хорошее,<br />\
//                     хотя и разговорное, и должно быть оценено не ниже 3</p>") )
//           .failure(getTooltip("guide").text("<p>Можно оценить предложение на 3-5, потому что<br />\
//                     это предложение хорошее, хотя и разговорное</p>") )
//     ,
//     newButton("continue", "Продолжить")
//         .cssContainer({"transform": "scale(1.8)"})
//         .center().print("center at 50%", "center at 92%")
//         .wait()
//     ,
//     getText("test").remove()          // End of trial, remove "target"
// )


newTrial("context_practice-forced",
    defaultText.print()
    ,
    // Automatically start and wait for Timer elements when created, and log those events
    defaultTimer.log().start().wait()
    ,
    // newText("test", "Вчера у Маши машина сломалась, что теперь никуда ездить не может")
    //     .bold()
    //     .print("center at 50%", "center at 30%")
    // ,
    newText("item", "1. " + "Вчера у Маши машина сломалась, что теперь никуда ездить не может").bold(),
        getText("item")
            // .print()
            .print("center at 50%", "center at 40%")
    ,
    newText("item_other", "9. " + "Вчера у Маши машина сломалось, что теперь никуда ездить не может").bold(),
    getText("item_other")
        // .print()
        .print("center at 50%", "center at 60%")
    ,
    newTooltip("guide", 'Выберите наиболее приемлемое предложение, <br />\
                    (нажмите "1" для выбора верхнего предложения,<br />\
                    или "9" для выбора нижнего предложения)')
        .position("bottom center")  // Display it below the element it attaches to
        .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
        .print(getText("item_other"))   // Attach to the "target" Text element
    ,
    newVar("RT").global().set( v=>Date.now() )
    ,
    newSelector("forced_choice")
        .add(getText("item"), getText("item_other"))
        .keys("1", "9")
            // .print()
            .log()
            .wait().test.selected("item")
                .success(getTooltip("guide").text("<p>Верно, это предложение лучшее из двух.<br />\
                Хотя оно и разговорное, здесь глагол в подходящей форме (сломалАсь)</p>"))
                .failure(getTooltip("guide").text("<p>Нет, это предложение хуже, чем другое.<br />\
                Хотя оба разговорные, здесь глагол в неподходящей форме (сломалОсь)</p>"))
    ,

    newButton("continue", "Продолжить")
        .cssContainer({"transform": "scale(1.8)"})
        .center().print("center at 50%", "center at 92%")
        .wait()
    ,
    getText("item").remove()
    ,
    getText("item_other").remove()
);

Template(
    GetTable("examples_new_merged.csv")
        .filter(row => row.pair_id > 0)
    ,
    row => newTrial("" + row.type,
        defaultTimer.log().start().wait()
        ,
        newText("guide", '"1" - верхнее предложение, "9" - нижнее')
            .cssContainer({"font-size":"medium"})
            .italic()
            .print("center at 50%", "center at 7%")
        ,
        newTimer("break", 300)
            .start()
            .wait()
        ,
        newText("item", row.item).bold(),
        getText("item")
            // .print()
            .print("center at 50%", "center at 40%")
        ,
        // newText("top-num", "1").bold()
        //     .print("left at 5%", "center at 40%")
        // ,
        newText("item_other", row.item_other).bold(),
        getText("item_other")
            // .print()
            .print("center at 50%", "center at 60%")
        ,
        // newText("bottom-num", "9").bold()
        //     .print("left at 5%", "center at 60%")
        // ,
        newVar("RT").global().set( v=>Date.now() )
        ,
        newSelector("forced_choice")
            .add(getText("item"), getText("item_other"))
            .shuffle()
            .keys("1", "9")
                // .print()
                .log()
                .wait()
        ,
        
        getVar("RT").set( v=>Date.now()-v )
    )
    .label([row.type, row.pair_id])
    .log("pair_id", row.pair_id)
    .log("type",row.type)
    .log("compl", row.compl)
    .log("RT", getVar("RT"))
);



// Send the results
SendResults("send");

// A simple final screen
newTrial ( "final" ,
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
.setOption("countsForProgressBar",false)