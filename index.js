import express from "express";

const app = express();
const port = 3000;
var count = 2;
var posts = [
    {
        id: 0, title: "Badminton tips & tricks", content: `Badminton is a racquet sport played using racquets to hit a shuttlecock across a net. Although it may be played with larger teams, the most common forms of the game are "singles" (with one player per side) and "doubles" (with two players per side).`, author: "Anshu Suthar", time: "01:10 PM • 18/01/2024"
    },
    {
        id: 1, title: "Computer programming Path", content: "Computer programming or coding is the composition of sequences of instructions, called programs, that computers can follow to perform tasks. It involves designing and implementing algorithms, step-by-step specifications of procedures, by writing code in one or more programming languages.", author: "Chintu Charkat", time: "10:03 PM • 17/01/2024"
    }
];


function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getDateTime() {
    let d = new Date();

    let ampm = "AM";
    let hour = d.getHours() + 1;
    if(hour == 0 ){
        hour = 12;
    } else if (hour >= 12) {
        ampm = "PM";
        if(hour != 12) {
            hour = hour - 12;
        }
    }

    let datetime =  pad(hour,2) + ":"  
                    + pad(d.getMinutes(),2) + " " + ampm + " • "
                    + pad(d.getDate(),2) + "/"
                    + pad((d.getMonth()+1),2)  + "/" 
                    + pad(d.getFullYear(),4)
    
    return datetime;
}

function logger(req, res, next) {
    console.log("Count: " + count + "----------------------------------------")
    console.log(posts);
    next();
}

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
// app.use(logger);

app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: posts,
    });
})

app.get("/create", (req, res) => {
    res.render("create.ejs");
})

app.post("/post", (req, res) => {
    var clock = getDateTime();

    var temp = {id: count++};
    temp = Object.assign(temp, req.body)
    temp = Object.assign(temp, {time: clock});
    posts.push(temp);
    res.redirect("/");
})

app.get("/edit", (req, res) => {
    res.render("edit.ejs");
})

app.post("/edit", (req, res) => {
    let author = req.body.author;

    let search_res = posts.filter((obj) => {
        return obj.author === author;
    });

    res.render("edit.ejs", {
        posts: search_res
    })
})

app.get("/edit_form", (req, res) => {
    let id = req.query.id;

    let search_res = posts.filter((obj) => {
        return obj.id == id;
    });

    res.render("edit_form.ejs", {
        posts: search_res
    })
})

app.post("/edit_form", (req, res) => {
    let post = req.body;
    post.id = parseInt(post.id);

    let idx = posts.findIndex((p) => {
        return p.id === post.id;
    })
    posts[idx] = post;

    res.redirect("/");
})

app.get("/delete", (req, res) => {
    res.render("delete.ejs");
})

app.post("/delete", (req, res) => {
    let author = req.body.author;

    let search_res = posts.filter((obj) => {
        return obj.author === author;
    });

    res.render("delete.ejs", {
        posts: search_res
    })
})

app.post("/delete_form", (req, res) => {
    let post = req.body;

    let idx = posts.findIndex((p) => {
        return p.id == post.id;
    })

    posts.splice(idx,1);

    res.redirect("/");
})

app.listen(port, () => {
    console.log("Server online...");
})