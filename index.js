const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
const nodemailer = require('nodemailer');
//app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gi_coconut_dev'
};
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
        const [rows] = await connection.execute('SELECT * FROM people_info order by people_timestamp DESC');
        res.json(rows);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});
app.post('/api/InsertRegisterinfo', async (req, res) => {
    try {
        var username = req.body.username;
        var password = req.body.password;
        if (!username && !password) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const mailOptions = {
            from: 'cpe.latea2@gmail.com',
            to: 'cpe.latea1@gmail.com',
            subject: 'Hello from Node.js!',
            text: 'This is a test email sent from Node.js using nodemailer.',
        };

        // ส่งอีเมล
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        console.log("request incoming");
        console.log(req.body);
        // console.log(req.headers);
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
        var is_gi = req.body.is_gi;
        var gi_certificates = req.body.gi_certificates;
        var is_dna = req.body.is_dna;
        var dna_certificates = req.body.dna_certificates;
        var people_password = req.body.people_password;
        var is_term = req.body.is_term;
        var people_generate = req.body.people_generate;
        var is_status = req.body.is_status;
        if (!people_name) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('insert into people_info (people_image_profile,people_name,people_localtion_number,people_moo,people_road,people_alley,people_tumbon,people_district,people_province,people_postcode,people_phone,people_email,people_cardnumber,is_gi_certificate,gi_certificates,is_dna_certificate,dna_certificates,people_password,people_term,people_generate,is_status) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [people_image_profile, people_name, people_localtion_number, people_moo, people_road, people_alley, people_tumbon, people_district, people_province, people_postcode, people_phone, people_email, people_cardnumber, is_gi, gi_certificates, is_dna, dna_certificates, people_password, is_term, people_generate, is_status]);
        res.json(rows);
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
        var people_postcode = req.body.people_postcode;
        var people_phone = req.body.people_phone;
        var people_email = req.body.people_email;
        var people_cardnumber = req.body.people_cardnumber;
        var people_password = req.body.people_password;
        var people_term = req.body.people_term;
        var people_image_profile = req.body.people_image_profile;
        var is_status = req.body.is_status;
        var people_generate = req.body.people_generate;
        console.log(req.body);
        if (!people_name) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE people_info SET people_name = ?, people_localtion_number = ?, people_moo = ?, people_road = ?, people_alley = ?, people_tumbon = ?, people_district = ?, people_province = ?, people_postcode = ?, people_phone = ?, people_email = ?, people_cardnumber = ?, people_password = ?, people_term = ?, people_image_profile = ?, is_status = ? WHERE people_generate = ? ', [people_name, people_localtion_number, people_moo, people_road, people_alley, people_tumbon, people_district, people_province, people_postcode, people_phone, people_email, people_cardnumber, people_password, people_term, people_image_profile, is_status, people_generate]);
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
app.post('/api/SelectPeopleinfo', async (req, res) => {
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
app.post('/api/UpdatePeopleStatusinfo', async (req, res) => {
    try {
        var is_status = req.body.is_status;
        var people_generate = req.body.people_generate;
        console.log(req.body);
        if (!people_generate) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE people_info SET  is_status = ? WHERE people_generate = ? ', [is_status, people_generate]);
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
        var feature_trunk_description = req.body.feature_trunk_description; //1
        var feature_trunk_circumference1 = req.body.feature_trunk_circumference1; //2-1
        var feature_trunk_circumference2 = req.body.feature_trunk_circumference2; //2-2
        var feature_leaf_path_length = req.body.feature_leaf_path_length; //3
        var feature_leaf_stalk_length = req.body.feature_leaf_stalk_length; //4
        var feature_leaf_minor_length = req.body.feature_leaf_minor_length; //5
        var feature_leaflet_count = req.body.feature_leaflet_count;     //6
        var feature_stem_axis_length = req.body.feature_stem_axis_length;   //7
        var feature_female_flower_count = req.body.feature_female_flower_count;//8
        var feature_inflorescence_count = req.body.feature_inflorescence_count; //9
        var feature_vertical_pericarp_shape = req.body.feature_vertical_pericarp_shape; //10
        var feature_pericarp_circumference1 = req.body.feature_pericarp_circumference1; //11-1
        var feature_pericarp_circumference2 = req.body.feature_pericarp_circumference2; //11-2
        var feature_pericarp_color = req.body.feature_pericarp_color; //12
        var feature_seed_shape = req.body.feature_seed_shape; //13
        var feature_water_sweetness = req.body.feature_water_sweetness; //14
        var feature_flesh_thickness = req.body.feature_flesh_thickness; //15
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
        const [rows] = await connection.execute('INSERT INTO landuse_info(feature_trunk_description,feature_trunk_circumference1,feature_trunk_circumference2,feature_leaf_path_length,feature_leaf_stalk_length,feature_leaf_minor_length,feature_leaflet_count,feature_stem_axis_length,feature_female_flower_count,feature_inflorescence_count,feature_vertical_pericarp_shape,feature_pericarp_circumference1,feature_pericarp_circumference2,feature_pericarp_color,feature_seed_shape,feature_water_sweetness,feature_flesh_thickness,province,amphures,districts,zip_code,point,landuse_lat,landuse_lng,is_status,people_generate)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [feature_trunk_description, feature_trunk_circumference1, feature_trunk_circumference2, feature_leaf_path_length, feature_leaf_stalk_length, feature_leaf_minor_length, feature_leaflet_count, feature_stem_axis_length, feature_female_flower_count, feature_inflorescence_count, feature_vertical_pericarp_shape, feature_pericarp_circumference1, feature_pericarp_circumference2, feature_pericarp_color, feature_seed_shape, feature_water_sweetness, feature_flesh_thickness, province, amphures, districts, zip_code, point, landuse_lat, landuse_lng, is_status, people_generate]);
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
        const [rows] = await connection.execute('SELECT li.*,pro.name_th as provinces_name_th,dis.name_th AS districts_name_th ,amp.name_th AS amphures_name_th FROM landuse_info as li LEFT JOIN provinces as pro on(li.province = pro.id) LEFT JOIN amphures as amp on(li.amphures = amp.id) LEFT JOIN districts as dis on(li.districts = dis.id) WHERE people_generate = ?;', [people_generate]);
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
        const [rows] = await connection.execute('SELECT * FROM landuse_info ORDER BY landuse_id DESC; ');
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
        const [rows] = await connection.execute('SELECT * FROM landuse_info WHERE landuse_id = ? ', [landuse_id]);
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
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE landuse_info SET  is_status = ? WHERE landuse_id = ? ', [is_status, landuse_id]);
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
        var landuse_color_of_shoot = req.body.color_of_shoot;
        var landuse_type_of_coconut = req.body.type_of_coconut;
        var landuse_bole = req.body.bole;
        var landuse_petiole_length = req.body.petiole_length;
        var landuse_leaflet_length = req.body.leaflet_length;
        var landuse_number_of_spikelets = req.body.number_of_spikelets;
        var landuse_peduncle_length = req.body.peduncle_length;
        var landuse_young_fruit_weight = req.body.young_fruit_weight;
        var landuse_shape = req.body.shape;
        var landuse_persent = req.body.valuenow;
        var landuse_lat = req.body.lat;
        var landuse_lng = req.body.lng;
        // var people_generate = req.body.people_generate;
        var is_status = req.body.is_status;
        var landuse_id = req.body.landuse_id;
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE landuse_info SET  landuse_color_of_shoot = ?,landuse_type_of_coconut = ?,landuse_bole = ?,landuse_petiole_length=?,landuse_leaflet_length=?,landuse_number_of_spikelets=?,landuse_peduncle_length=?,landuse_young_fruit_weight=?,landuse_shape=?,landuse_persent=?,landuse_lat=?,landuse_lng=?,is_status=? WHERE landuse_id = ? ', [landuse_color_of_shoot, landuse_type_of_coconut, landuse_bole, landuse_petiole_length, landuse_leaflet_length, landuse_number_of_spikelets, landuse_peduncle_length, landuse_young_fruit_weight, landuse_shape, landuse_persent, landuse_lat, landuse_lng, is_status, landuse_id]);
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
        console.log(req.body);
        if (!landuse_id) {
            res.status(400).json({ error: 'Missing required parameter' });
            return;
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('UPDATE landuse_info SET  is_status = ? WHERE landuse_id = ? ', [is_status, landuse_id]);
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});