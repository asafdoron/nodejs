'use strict';


import fs from 'fs';
import { Buffer } from 'buffer';

const pdfPath = './pdfParser/sig.pdf';

let pdfBuf = null;
let pdfLen = 0;

function readPdf()
{
        
    let fd = fs.openSync(pdfPath, 'r');

    pdfLen = fs.statSync(pdfPath).size;

    pdfBuf = Buffer.alloc(pdfLen);
    fs.readSync(fd, pdfBuf, 0, pdfLen, 0);

    fs.close(fd);

    let pdfStr = pdfBuf.toString('utf8');

    console.log(pdfStr);
    
}




// function readTrailer()
// {
        
//     let fd = fs.openSync(pdfPath, 'r');

//     let pdfLen = fs.statSync(pdfPath).size;

//     let buffer = Buffer.alloc(1024);
//     fs.readSync(fd, buffer, 0, 1024, pdfLen - 1024);

//     let trailer = buffer.toString('utf8');
//     console.log(trailer);
   
//     return trailer;

// }

function readTrailer()
{
    let buffer = pdfBuf.subarray(pdfLen - 1024);
    
    let trailer = buffer.toString('utf8');
    console.log(trailer);
   
    return trailer;

}

async function readTrailerAsync()
{
    fs.open(pdfPath, 'r', (err, fd) => {
        if (err) {
            console.error(err);
            return;
        }
    
        // let pdfLen = fs.statSync(pdfPath).size;

        fs.stat(pdfPath, (err, stats) => {
            if (err) {
              console.error(err);
              return;
            }

            let pdfLen = stats.size;
 
            let buffer = Buffer.alloc(1024);
            //fs.readSync(fd, buffer, 0, 1024, pdfLen - 1024);
            fs.read(fd, buffer, 0, 1024, pdfLen - 1024, (err, bytesRead, buffer) => {
                if (err) {
                  console.error(err);
                  return;
                }

                if (bytesRead==0) {
                    console.log('bytesRead==0');
                    return;
                  }

                let trailer = buffer.toString('utf8');
                console.log(trailer);

                let startxref = getStartxref(trailer);
                let prev = getPrev(trailer);
                let size = getSize(trailer);
            });

        });

      });
}

function getStartxref(trailer)
{
    // 1. find startxref
    // 2. seek startxref
    // 3. read objects position
    // 4. if prev => goto 1


    // let lines = trailer.split(/\r\n|\r|\n/);

    // if(lines.includes('startxref'))
    // {
    //     console.log('found startxref');
    // }

    // let m = trailer.match(/startxref[\r\n|\r|\n](\d+)/);
    let m = trailer.match(/startxref\s+(\d+)/);

    console.log(`startxref = ${m[1]}`);

}

function getPrev(trailer)
{

    let m = trailer.match(/<<.*Prev\s+(\d+).*>>/);

    console.log(`prev = ${m[1]}`);

}

function getSize(trailer)
{

    let m = trailer.match(/<<.*Size\s+(\d+).*>>/);

    console.log(`Size = ${m[1]}`);

}


// // readTrailer();
// await readTrailerAsync();
// console.log('After readTrailerAsync');

readPdf();
trailer = readTrailer();

console.log('END');
