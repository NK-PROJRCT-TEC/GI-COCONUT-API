const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const { dbConfig } = require('./config'); // เรียกใช้ configuration จากไฟล์

const app = express();
const port = 4001;
const nodemailer = require('nodemailer');
//app.use(bodyParser.json());
app.use(express.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Send Mail
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'cpe.latea2@gmail.com',
        pass: 'eqrifgfusswgijjb',
    },
});
//กรณีนี้เป็นการดึงข้อมูล
app.get('/api/SelectWaitingApproveisStatus', async (req, res) => {
    try {
        var people_generate = req.params.people_generate;
        var is_status = req.params.is_status;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM people_info WHERE is_status= "1" ');
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.get('/api/SelectPendingStatus', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT pi.*,p.name_th as people_province_th,a.name_th as people_district_th,d.name_th as people_tumbon_th FROM people_info as pi LEFT JOIN provinces p on (pi.people_province = p.id) LEFT JOIN amphures a on (pi.people_district = a.id) LEFT JOIN districts d on (pi.people_tumbon = d.id)  order by people_timestamp DESC');
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertRegisterinfo', async (req, res) => {
    try {
        const mailOptions = {
            from: 'cpe.latea2@gmail.com',
            to: req.body.people_email,
            subject: 'ทดสอบหัวข้อ',
            text: 'ทดสอบรายละเอียด',
        };
        const connection = await mysql.createConnection(dbConfig);
        const [check] = await connection.execute('SELECT people_email FROM people_info where people_email = ?;', [req.body.people_email]);
        if (check.length > 0) {
            res.json(check);
        } else {

            var people_image_profile = req.body.people_image_profile;
            var people_name = req.body.people_name;
            var people_localtion_number = req.body.people_localtion_number;
            var people_moo = req.body.people_moo;
            var people_road = req.body.people_road;
            var people_alley = req.body.people_alley;
            var people_tumbon = req.body.people_tumbon;
            var people_district = req.body.people_district;
            var people_province = req.body.people_province;
            var people_postcode = req.body.people_postcode;
            var people_phone = req.body.people_phone;
            var people_email = req.body.people_email;
            var people_cardnumber = req.body.people_cardnumber;
            var is_gi_certificate = req.body.is_gi;
            var gi_certificates = req.body.gi_certificates;
            var is_dna_certificate = req.body.is_dna;
            var dna_certificates = req.body.dna_certificates;
            var people_password = req.body.people_password;
            var people_generate = req.body.people_generate;
            var is_status = req.body.is_status;
            var people_generate = req.body.people_generate;
            var people_term = req.body.is_term;
            console.log(req.body);
            if (!people_email) {
                res.status(400).json({ error: 'Missing required parameter' });
                return;
            }
            const connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('insert into people_info (people_image_profile,people_name,people_localtion_number,people_moo,people_road,people_alley,people_tumbon,people_district,people_province,people_postcode,people_phone,people_email,people_cardnumber,is_gi_certificate,gi_certificates,is_dna_certificate,dna_certificates,people_password,people_term,people_generate,is_status) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [people_image_profile, people_name, people_localtion_number, people_moo, people_road, people_alley, parseInt(people_tumbon), parseInt(people_district), parseInt(people_province), people_postcode, people_phone, people_email, people_cardnumber, is_gi_certificate, gi_certificates, is_dna_certificate, dna_certificates, people_password, people_term, people_generate, is_status]);
            //ส่งอีเมล
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            res.json(rows);
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertHistory', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var is_status = req.body.is_status;
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('insert into history_approve (is_status,people_generate) values (?,?)', [is_status, people_generate]);
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/UpdateApproveStatusinfo', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var employee_name = req.body.employee_name;
        var is_status = req.body.is_status;
        console.log("TEST");
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('insert into history_approve (is_status,history_who_is,people_generate) values (?,?,?)', [is_status, employee_name, people_generate]);
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertHistoryReject', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var history_remark = req.body.history_remark;
        var history_who_is = req.body.employee_name;
        var is_status = req.body.is_status;
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('insert into history_approve (people_generate,is_status,history_who_is,history_remark) values (?,?,?,?)', [people_generate, is_status, history_who_is, history_remark]);
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/UpdateStatusPeople', async (req, res) => {
    try {
        var people_name = req.body.people_name;
        var people_localtion_number = req.body.people_localtion_number;
        var people_moo = req.body.people_moo;
        var people_road = req.body.people_road;
        var people_alley = req.body.people_alley;
        var people_tumbon = req.body.people_tumbon;
        var people_district = req.body.people_district;
        var people_province = req.body.people_province;
        var people_postcode = req.body.people_postcode.toString();
        var people_phone = req.body.people_phone;
        var people_email = req.body.people_email;
        var people_cardnumber = req.body.people_cardnumber;
        var is_gi_certificate = req.body.is_gi_certificate;
        var people_password = req.body.people_password;
        var people_term = req.body.people_term;
        var people_image_profile = req.body.people_image_profile;
        var is_status = req.body.is_status;
        var people_generate = req.body.people_generate;
        var is_gi_certificate = req.body.is_gi_certificate.toString();
        var gi_certificates = req.body.gi_certificates;
        var is_dna_certificate = req.body.is_dna_certificate.toString();
        var dna_certificates = req.body.dna_certificates;
        console.log(req.body);
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE people_info SET people_image_profile = ?,people_name = ?, people_localtion_number = ?, people_moo = ?, people_road = ?, people_alley = ?, people_tumbon = ?, people_district = ?, people_province = ?, people_postcode = ?, people_phone = ?, people_cardnumber = ?,	is_gi_certificate=?,	gi_certificates=? ,	is_dna_certificate=?,	dna_certificates=?, is_status = ? WHERE people_generate = ? ', [people_image_profile, people_name, people_localtion_number, people_moo, people_road, people_alley, people_tumbon, people_district, people_province, people_postcode, people_phone, people_cardnumber, is_gi_certificate, gi_certificates, is_dna_certificate, dna_certificates, is_status, people_generate]);
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectPeopleforUpdate', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM people_info where people_generate = ?;', [people_generate]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectHistoryApproveLanduse', async (req, res) => {
    try {
        var landuse_id = req.body.landuse_id;
        console.log(landuse_id);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('select * from history_apporve_landuse WHERE landuse_id = ?;', [landuse_id]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.post('/api/SelectPeopleinfo', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT pi.*,p.name_th as people_province,a.name_th as people_district,d.name_th as people_tumbon FROM people_info as pi LEFT JOIN provinces p on (pi.people_province = p.id) LEFT JOIN amphures a on (pi.people_district = a.id) LEFT JOIN districts d on (pi.people_tumbon = d.id) where people_generate = ?;', [people_generate]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/UpdatePeopleStatusinfo', async (req, res) => {
    try {
        var is_status = req.body.is_status;
        var people_generate = req.body.people_generate;
        var people_name = req.body.people_name;
        var landuse_timestamp = req.body.landuse_timestamp;
        if (is_status == "0") {
            //reject
            const mailOptions = {
                from: 'cpe.latea2@gmail.com',
                to: req.body.people_email,
                subject: 'เรียนคุณ ' + people_name,
                text: 'คุณไม่ผ่านการตรวจสอบจากเจ้าหน้าที่ กรุณาตรวจสอบข้อมูล ' + landuse_timestamp,
            };
        } else {
            //approve
            const mailOptions = {
                from: 'cpe.latea2@gmail.com',
                to: req.body.people_email,
                subject: 'เรียนคุณ ' + people_name,
                text: 'คุณได้ผ่านการตรวจสอบจากเจ้าหน้าที่แล้ว ' + landuse_timestamp,
            };
        }


        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE people_info SET  is_status = ? WHERE people_generate = ? ', [is_status, people_generate]);
        //ส่งอีเมล
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
}
app.post('/api/Login', async (req, res) => {
    try {
        var username = req.body.username;
        var password = req.body.password;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM people_info WHERE people_email = ? and people_password = ?   ', [username, password]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectWaitingApproveisStatus', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var is_status = req.body.is_status;
        if (!people_generate && !is_status) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT people_info.*,history_approve.is_status as history_approve_is_status,history_approve.history_timestamp as history_timestamp,history_approve.history_remark as history_remark FROM history_approve LEFT JOIN people_info on (history_approve.people_generate = people_info.people_generate) WHERE history_approve.people_generate = ?  order by history_id ASC', [people_generate]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/EmployeeLogin', async (req, res) => {
    try {
        var employee_email = req.body.employee_email;
        var employee_password = req.body.employee_password;
        if (!employee_email && !employee_password) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM employee_info WHERE employee_email = ? and employee_password = ? ', [employee_email, employee_password]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/insert_coin', async (req, res) => {
    try {
        var coin = req.body.coin;
        var coinid = req.body.coinid;
        console.log(coin);
        if (!coin) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('INSERT INTO commodity(commodity_id,commodity)VALUES(?,?)', [coinid, coin]);
        res.json({ Result: "OK" });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertLanduseInfo', async (req, res) => {
    try {
        var coconut_base_characteristics = req.body.coconut_base_characteristics;
        var base_to_ground_distance_20cm = req.body.base_to_ground_distance_20cm;
        var base_to_ground_distance_150cm = req.body.base_to_ground_distance_150cm;
        var track_measurement_1_to_17 = req.body.track_measurement_1_to_17;
        var leaf_stalk_length = req.body.leaf_stalk_length;
        var leaf_stalk_width = req.body.leaf_stalk_width;
        var length_of_leaf_segment_with_leaflet = req.body.length_of_leaf_segment_with_leaflet;
        var count_of_left_subleaflets = req.body.count_of_left_subleaflets;
        var length_of_subleaflet = req.body.length_of_subleaflet;
        var production_jan_to_apr = req.body.production_jan_to_apr;
        var production_may_to_aug = req.body.production_may_to_aug;
        var production_sep_to_dec = req.body.production_sep_to_dec;
        var production_image = req.body.production_image;
        var husked_fruit_peel_width = req.body.husked_fruit_peel_width;
        var husked_fruit_peel_length = req.body.husked_fruit_peel_length;
        var husked_no_fruit_peel_width = req.body.husked_no_fruit_peel_width;
        var husked_no_fruit_peel_length = req.body.husked_no_fruit_peel_length;
        var boundary_length = req.body.boundary_length;
        var husk_skin_color = req.body.husk_skin_color;
        var seed_structure = req.body.seed_structure;
        var fresh_fruit_weight = req.body.fresh_fruit_weight;
        var plant_age = req.body.plant_age;
        var tree_canopy_shape = req.body.tree_canopy_shape;
        var tree_quantity = req.body.tree_quantity;
        var planting_space = req.body.planting_space;
        var province = req.body.is_province;
        var amphures = req.body.is_amphures;
        var districts = req.body.is_districts;
        var zip_code = req.body.zip_code;
        var point = req.body.valuenow;
        var landuse_lat = req.body.lat;
        var landuse_lng = req.body.lng;
        var is_status = req.body.is_status;
        var people_generate = req.body.people_generate;
        console.log(req.body);
        if (!is_status) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('INSERT INTO landuse_info(coconut_base_characteristics, base_to_ground_distance_20cm, base_to_ground_distance_150cm, track_measurement_1_to_17, leaf_stalk_length, leaf_stalk_width, length_of_leaf_segment_with_leaflet, count_of_left_subleaflets, length_of_subleaflet, production_jan_to_apr, production_may_to_aug, production_sep_to_dec, production_image, husked_fruit_peel_width, husked_fruit_peel_length, husked_no_fruit_peel_width, husked_no_fruit_peel_length, boundary_length, husk_skin_color, seed_structure, fresh_fruit_weight, plant_age, tree_canopy_shape, tree_quantity, planting_space,province,amphures,districts,zip_code,point,landuse_lat,landuse_lng,is_status,people_generate)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [coconut_base_characteristics, base_to_ground_distance_20cm, base_to_ground_distance_150cm, track_measurement_1_to_17, leaf_stalk_length, leaf_stalk_width, length_of_leaf_segment_with_leaflet, count_of_left_subleaflets, length_of_subleaflet, production_jan_to_apr, production_may_to_aug, production_sep_to_dec, production_image, husked_fruit_peel_width, husked_fruit_peel_length, husked_no_fruit_peel_width, husked_no_fruit_peel_length, boundary_length, husk_skin_color, seed_structure, fresh_fruit_weight, plant_age, tree_canopy_shape, tree_quantity, planting_space, province, amphures, districts, zip_code, point, landuse_lat, landuse_lng, is_status, people_generate]);
        const [row] = await connection.execute('SELECT * FROM landuse_info ORDER BY landuse_id DESC LIMIT 1 ');
        res.json(row);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectLandusebyPeopleGenerate', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        console.log(req.body);
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT li.*,pro.name_th as provinces_name_th,dis.name_th AS districts_name_th ,amp.name_th AS amphures_name_th FROM landuse_info as li LEFT JOIN provinces as pro on(li.province = pro.id) LEFT JOIN amphures as amp on(li.amphures = amp.id) LEFT JOIN districts as dis on(li.districts = dis.id) WHERE people_generate = ? order by li.landuse_id DESC;', [people_generate]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertHistoryLanduse', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var is_status = req.body.is_status;
        var landuse_id = req.body.landuse_id;
        console.log(req.body);
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('INSERT INTO history_apporve_landuse (people_generate,landuse_id,is_status)VALUES(?,?,?)', [people_generate, landuse_id, is_status]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectLandUseInfo', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var is_status = "1";
        console.log(req.body);
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM landuse_info WHERE is_status = ? and people_generate = ? ', [is_status, people_generate]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.get('/api/SelectLandUseInfo', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT li.*,pro.name_th as provinces_name_th,amp.name_th as amphures_name_th,dis.name_th as districts_name_th FROM landuse_info as li left join provinces as pro on (li.province = pro.id) left join amphures as amp on (li.amphures = amp.id) left join districts dis on (li.districts = dis.id) ORDER BY landuse_id DESC;');
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectLandUseInfoByLanduseID', async (req, res) => {
    try {
        var landuse_id = req.body.landuse_id;
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT li.* ,pro.name_th as provinces_name_th,amp.name_th as amphures_name_th,dis.name_th as districts_name_th FROM landuse_info as li left join provinces as pro on (li.province = pro.id) left join amphures as amp on (li.amphures = amp.id) left join districts as dis on (li.districts = dis.id) WHERE landuse_id = ?;', [landuse_id]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertHistoryApporveLanduseReject', async (req, res) => {
    try {
        var landuse_id = req.body.landuse_id;
        var history_remark = req.body.history_remark;
        var employee_name = req.body.employee_name;
        var is_status = req.body.is_status;
        var people_generate = req.body.people_generate;
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('INSERT INTO history_apporve_landuse (landuse_id,people_generate,history_who_is,history_remark,is_status)VALUES(?,?,?,?,?)', [landuse_id, people_generate, employee_name, history_remark, is_status]);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/UpdateLanduseStatus', async (req, res) => {
    try {
        var is_status = req.body.is_status;
        var landuse_id = req.body.landuse_id;
        var people_name = req.body.people_name;
        var landuse_timestamp = req.body.landuse_timestamp;
        if (is_status == "0") {
            //reject
            const mailOptions = {
                from: 'cpe.latea2@gmail.com',
                to: req.body.people_email,
                subject: 'เรียนคุณ ' + people_name,
                text: 'คุณไม่ผ่านการตรวจสอบข้อมูลขอขึ้นทะเบียนจากเจ้าหน้าที่ กรุณาตรวจสอบข้อมูล ' + landuse_timestamp,
            };
        }
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE landuse_info SET  is_status = ? WHERE landuse_id = ? ', [is_status, landuse_id]);
        //ส่ง email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
//Edit Landuse people
app.post('/api/SelectLandUseByLandByID', async (req, res) => {
    try {
        var landuse_id = req.body.landuse_id;
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM landuse_info WHERE landuse_id = ? ', [landuse_id]);
        res.json(rows);
        // res.json("OK"); 
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
//
app.post('/api/UpdateLanduseInfo', async (req, res) => {
    try {
        var coconut_base_characteristics = req.body.coconut_base_characteristics;
        var base_to_ground_distance_20cm = req.body.base_to_ground_distance_20cm;
        var base_to_ground_distance_150cm = req.body.base_to_ground_distance_150cm;
        var track_measurement_1_to_17 = req.body.track_measurement_1_to_17;
        var leaf_stalk_length = req.body.leaf_stalk_length;
        var leaf_stalk_width = req.body.leaf_stalk_width;
        var length_of_leaf_segment_with_leaflet = req.body.length_of_leaf_segment_with_leaflet;
        var count_of_left_subleaflets = req.body.count_of_left_subleaflets;
        var length_of_subleaflet = req.body.length_of_subleaflet;
        var production_jan_to_apr = req.body.production_jan_to_apr;
        var production_may_to_aug = req.body.production_may_to_aug;
        var production_sep_to_dec = req.body.production_sep_to_dec;
        var production_image = req.body.production_image;
        var husked_fruit_peel_width = req.body.husked_fruit_peel_width;
        var husked_fruit_peel_length = req.body.husked_fruit_peel_length;
        var husked_no_fruit_peel_width = req.body.husked_no_fruit_peel_width;
        var husked_no_fruit_peel_length = req.body.husked_no_fruit_peel_length;
        var boundary_length = req.body.boundary_length;
        var husk_skin_color = req.body.husk_skin_color;
        var seed_structure = req.body.seed_structure;
        var fresh_fruit_weight = req.body.fresh_fruit_weight;
        var plant_age = req.body.plant_age;
        var tree_canopy_shape = req.body.tree_canopy_shape;
        var tree_quantity = req.body.tree_quantity;
        var planting_space = req.body.planting_space;
        var province = req.body.is_province;
        var amphures = req.body.is_amphures;
        var districts = req.body.is_districts;
        var zip_code = req.body.zip_code;
        var landuse_lat = req.body.landuse_lat;
        var landuse_lng = req.body.landuse_lng;
        var landuse_id = req.body.landuse_id;
        var is_status = req.body.is_status;
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE landuse_info SET  coconut_base_characteristics = ?,base_to_ground_distance_20cm = ?,	base_to_ground_distance_150cm = ?,track_measurement_1_to_17=?,leaf_stalk_length=?,leaf_stalk_width=?,length_of_leaf_segment_with_leaflet=?,count_of_left_subleaflets=?,length_of_subleaflet=?,production_jan_to_apr=?,production_may_to_aug=?,production_sep_to_dec=?,production_image=?,husked_fruit_peel_width=?,	husked_fruit_peel_length=?,	husked_no_fruit_peel_width=?,husked_no_fruit_peel_length=?,boundary_length=?,husk_skin_color=?,seed_structure=?,fresh_fruit_weight=?,plant_age=?,tree_canopy_shape=?,tree_quantity=?,planting_space=?,province=?,amphures=?,districts=?,zip_code=?,	landuse_lat=?,landuse_lng=?,is_status=? WHERE landuse_id = ? ', [coconut_base_characteristics, base_to_ground_distance_20cm, base_to_ground_distance_150cm, track_measurement_1_to_17, leaf_stalk_length, leaf_stalk_width, length_of_leaf_segment_with_leaflet, count_of_left_subleaflets, length_of_subleaflet, production_jan_to_apr, production_may_to_aug, production_sep_to_dec, production_image, husked_fruit_peel_width, husked_fruit_peel_length, husked_no_fruit_peel_width, husked_no_fruit_peel_length, boundary_length, husk_skin_color, seed_structure, fresh_fruit_weight, plant_age, tree_canopy_shape, tree_quantity, planting_space, province, amphures, districts, zip_code, landuse_lat, landuse_lng, is_status, landuse_id]);
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
//approve landuse_info
app.post('/api/InsertHistoryApproveLandUseStatusinfo', async (req, res) => {
    try {
        var people_generate = req.body.people_generate;
        var landuse_id = req.body.landuse_id;
        var employee_name = req.body.employee_name;
        var is_status = req.body.is_status;
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('INSERT INTO history_apporve_landuse (landuse_id,people_generate,history_who_is,is_status)VALUES(?,?,?,?)', [landuse_id, people_generate, employee_name, is_status]);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/UpdateApproveLandUseStatusinfo', async (req, res) => {
    try {
        var is_status = req.body.is_status;
        var landuse_id = req.body.landuse_id;
        var point = req.body.point;
        var people_name = req.body.people_name;
        var landuse_timestamp = req.body.landuse_timestamp;
        point = point + "%";
        if (is_status == "2") {
            //reject
            const mailOptions = {
                from: 'cpe.latea2@gmail.com',
                to: req.body.people_email,
                subject: 'เรียนคุณ ' + people_name,
                text: 'คุณผ่านการตรวจสอบข้อมูลขอขึ้นทะเบียนจากเจ้าหน้าที่  ' + landuse_timestamp,
            };
        }
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE landuse_info SET  is_status = ?,point = ? WHERE landuse_id = ? ', [is_status, point, landuse_id]);
        //ส่ง email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        // res.json(rows);
        res.json("OK");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.get('/api/SelectProvinces', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM `provinces` WHERE 1 ');
        // console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.get('/api/SelectAmphures', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM `amphures` WHERE 1');
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.get('/api/SelectDistricts', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM `districts` WHERE 1');
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/SelectDistrictsByAmphureid', async (req, res) => {
    try {
        var amphure_id = req.body.amphure_id;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM `districts` WHERE amphure_id = ?', [amphure_id]);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/FilterDistrictsByid', async (req, res) => {
    try {
        var id = res.body.id;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT name_th FROM `districts` WHERE id = ?', [id]);
        // console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});