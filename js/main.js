const ui_url = 'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/ui_data.json';
const fe_url = 'https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json';
let data;
// 地區
const areaObj = {};
// 年齡
const ageObj = {};
// 性別
const genderValues = [0, 0];
// 學歷
const eduObj = {};
// 技能＋工具

const skillObj = {
    '前端語言': 0,
    '設計工具': 0,
    '後端語言': 0
};

const skillTypes = {
    FE: ['HTML、CSS', 'JAVASCRIPT', 'VSCODE', 'JQUERY', '略知 HTML CSS JS'],
    DS: ['ADOBEXD', 'AFTEREFFECTS', 'AXURE', 'FIGMA', 'ILLUSTRATOR', 'PHOTOSHOP', 'SKETCH', 'ZEPLIN', '視覺設計,行銷,SEO'],
    BE: ['MYSQL', 'SWIFT', '後端應用 (PHP、PYTHON、NODE.JS)']
}

// init
getData('UI');
function getData(type){
    const url = type === 'FE' ? fe_url : ui_url;
    axios.get(url)
    .then(res => {
        data = res.data;
        type === 'FE' ? countFEdata() : countUIdata();
        renderChart();
    })
    .catch(err => {
        console.log(err);
    })
}

document.querySelector('.js-datatype').addEventListener('click', e => {
    if (e.target.nodeName === 'A') {
        getData(e.target.dataset.type);
    }
})

function countFEdata() {
    console.log('FE')
}

function countUIdata() {
    let skillData = [];
    data.forEach(el => {
        const area = el.company.area.replace('台灣 - ', '');
        areaObj[area] === undefined ? areaObj[area] = 1 : areaObj[area]++;
        ageObj[el.age] === undefined ? ageObj[el.age] = 1 : ageObj[el.age]++;
        el.gender === "男性" ? genderValues[0]++ : genderValues[1]++;
        eduObj[`${el.major}, ${el.education}`] === undefined ? eduObj[`${el.major}, ${el.education}`] = 1 : eduObj[`${el.major}, ${el.education}`]++;
        skillData.push(el.first_job.skill.split(', '));
        skillData.push(el.first_job.software.split(', '));
    })
    skillData = skillData.flat().filter(el => el).map(el => el.replace('Aftereffect','AFTEREFFECTS').toUpperCase().replace('AE','AFTEREFFECTS').replace(' ','').replace('......', ''));
    skillData.forEach(el => {
        if (skillTypes.FE.indexOf(el) > 0) {
            skillObj['前端語言']++;
            return;
        }
        if (skillTypes.DS.indexOf(el) > 0) {
            skillObj['設計工具']++;
            return;
        }
        if (skillTypes.BE.indexOf(el) > 0) {
            skillObj['後端語言']++;
            return;
        }
    })
    let str = '';
    const arr = ['FE','DS','BE']
    Object.keys(skillObj).forEach((el, index) => {
        str += `<div>
                  <strong>${el}</strong>
                  <p>${Object.values(skillTypes)[index].join("、")}</p>
                </div>
        `;
    })
    document.querySelector('.js-skill').innerHTML = str;

}

function renderChart() {
    new Chart(document.getElementById('areaChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(areaObj),
            datasets: [{
                label: '單位：人',
                data: Object.values(areaObj),
                backgroundColor: '#8E7DFA',
                
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            axis: {
                y: 50
            }
        }
    });

    new Chart(document.getElementById('ageChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(ageObj),
            datasets: [{
                label: '單位：人',
                data: Object.values(ageObj),
                backgroundColor: '#8E7DFA',
                
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            axis: {
                y: 50
            }
        }
    });

    new Chart(document.getElementById('genderChart'), {
        type: 'pie',
        data: {
            labels: ['男', '女'],
            datasets: [{
                data: genderValues,
                backgroundColor: ['#8E7DFA', '#D2CBFD'],
            }]
        }
    });

    new Chart(document.getElementById('skillChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(skillObj),
            datasets: [{
                label: '技術／軟體類型',
                data: Object.values(skillObj),
                backgroundColor: '#8E7DFA',
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
        }
    });
}