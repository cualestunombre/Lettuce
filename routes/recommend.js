const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");

router.get("/", isLoggedIn, async (req, res, next) => {
    id = req.user.id
    const rec_query = `select f2.followed, count(f2.followed) as cnt, u.profile, u.email, u.nickName, u.id
    from follow as f1 join follow as f2 on f1.followed = f2.follower join users as u on f2.followed = u.id
    where f1.follower = "${id}" and f2.followed != "${id}"
    group by f2.followed order by count(f2.followed) desc;`;
    const rec_data = await sequelize.query(rec_query, { type: QueryTypes.SELECT });

    rec_data.forEach(async (ele, i) => {
        const rec_query2 = `select nickName from users as u join follow as f on u.id = f.follower where followed = "${ele.followed}" and follower != "${id}" limit 1;`
        const rec_data2 = await sequelize.query(rec_query2, { type: QueryTypes.SELECT });
        rec_data[i].friend = rec_data2[0].nickName;
    });

    res.send(rec_data);
});

module.exports = router;