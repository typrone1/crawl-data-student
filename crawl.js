const request = require('request-promise')
const fs = require('fs');

const URL = 'http://daotao.vimaru.edu.vn/system/ajax/'

const crawl = async (students, results) => {
    return results = await Promise.all(students.map(masv => crawlPage(masv))).then(data => data)
}

const crawlPage = (masv) => {
    let isError = false
    return getPageContent(masv)
        .then(({ masv, $ }) => {
            return html2Student($)
        }).catch(error => {
            isError = true
        }).then((student) => {
            return isError ? masv : student
        })
}

const html2Student = (data) => {
    var result = [];
    try {
        let str = data[1].data
        res = String(str.match(/<pre>Mã sinh viên:   <b>(.*)<\/b><br>Lớp hành chính/g))
        res = res.replace('<pre>Mã sinh viên:   <b>', '')
        res = res.replace('</b><br>Họ tên:         <b>', ',')
        res = res.replace('</b><br>Ngày sinh:      <b>', ',')
        res = res.replace('</b><br>Lớp hành chính', '')
        res = res.replace('/', '')
        res = res.replace('/', '')
        console.log(res)
        if (res != 'null') {
            fs.appendFileSync('students.txt', res + '\n');
        }
        result = res.split('-')
    }
    catch (err) {

    }
    return result;
}
const getPageContent = (masv) => {
    const options = {
        method: 'POST',
        url: URL,
        form:
        {
            masv: masv,
            form_build_id: 'form-Wem9egpKfEbzsLRnT6zaTS-lEPqJQm8OXw4Jap3aq30',
            form_id: 'lich_thi_form'
        },
        json: true
    }
    return request(options)
        .then(($) => {
            return {
                $,
                masv,
            }
        })
}

console.time('crawl > ')
const students = []
for (let i = 55500; i <= 55555; i++) {
    students.push(i)
}
const results = []
crawl(students, results).then((listStudent) => {
    if (!listStudent)
        return
    console.log(`Crawl finish with ${listStudent.length} students`)
    return
}).then(() => {
    console.timeEnd('crawl > ')
    process.exit()
})