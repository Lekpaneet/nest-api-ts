import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import { InternalServerErrorException } from "@nestjs/common";
import * as _ from "lodash";
import * as fs from "fs";

export interface infOptionsGenerNodeId {
    propId: string;
    typeId: string;
    eventId: string;
    numberId: number;
    devMode?: boolean;
}

@Injectable()
export class TaskFunctionsService {
  private passCertKey: string = "U2FsdGVkX1+gbrkoRfie6caeZ3NM/Xoux0uGQBOiiyY=";
  private pathLocalEnc: string = "/Users/paneet/Documents/enc/";
  private pathDesktopEnc: string = "/Users/paneet/Desktop/enc/";

  generateNoteId = (object: infOptionsGenerNodeId): string => {
    if (object.propId.length > 0 && object.propId.length <= 8) {
      const propIdConvert = _.toUpper(_.padEnd(object.propId, 8, "0"));
      const typeIdConvert = _.toUpper(object.typeId);
      const eventIdConvert = _.padStart(object.eventId, 3, "0")
      const runNoConvert = object.numberId >= 99 ? 99 : _.padStart(`${object.numberId}`, 2, "0");
      return object.devMode
        ? `${propIdConvert}-${typeIdConvert}-${eventIdConvert}-${runNoConvert}`
        : `${propIdConvert}${typeIdConvert}${eventIdConvert}${runNoConvert}`;
    }
    throw new InternalServerErrorException("PropId Invalid!");
  };

  getContent() {
    return `D|199|PAMCO|PB12097||อวยชั|00|25/06/2021|รับโอนชำระหนี้|A|บ้านแฝด|Residential|ฉ.61257||กุมภวาปี|กุมภวาปี|อุดรธานี|ภาคตะวันออกเฉียงเหนือ|0000-0-30.0|||||||1700000|2350000||1880000|10/06/2021|||25/11/2016|24/11/2021|24/11/2026|25/11/2016||2350000||||||||||12/06/2023|G - 3 จังหวัดชายแดนภาคใต้ - สำรวจ - มีผู้อยู่อาศัย|จัดการสินทรัพย์||19/06/2022||||||||||||||||||3045.67|1202.10|171.68|324.54|490.12|382.70|37058.12|2482.91|248.12|5696.69|42420.15|38302.29|8875.28|8922.56|245.18|149868.11
    T|87|03/08/2023|03/08/2023|2535774899.67|32397367900.25|1484715211.38|NPA_PROTFOLIO_PAMCO_20230803.TXT`;
  }

  encryptCdc256ByFile(fileText: string) {
    try {
      const fileEnc = `${Date.now()}-ENCRYPTED.enc`;
      const filePathName = `${this.pathDesktopEnc}${fileText}`;
      const fileEncoding = `${this.pathDesktopEnc}${fileEnc}`;

      if (fs.existsSync(filePathName)) {
        const openssl = spawn("openssl", [
          "enc",
          "-aes-256-cbc",
          "-a",
          "-salt",
          "-in",
          `${filePathName}`,
          "-pass",
          `pass:${this.passCertKey}`,
          "-out",
          `${fileEncoding}`,
        ]);
        openssl.unref();

        return `Encrypt ENC : ${fileEncoding}`;
      }
      return "Path file is wrong!";
    } catch (error) {
      throw new Error(error);
    }
  }

  decryptCdc256ByFile(fileEnc: string) {
    try {
      const fileText = `DECRYPTED-${Date.now()}.txt`;
      const filePathName = `${this.pathDesktopEnc}${fileEnc}`;
      const fileEncoding = `${this.pathDesktopEnc}${fileText}`;

      if (fs.existsSync(filePathName)) {
        const openssl = spawn("openssl", [
          "enc",
          "-aes-256-cbc",
          "-d",
          "-a",
          "-salt",
          "-in",
          `${filePathName}`,
          "-pass",
          `pass:${this.passCertKey}`,
          "-out",
          `${fileEncoding}`,
        ]);
        openssl.unref();

        return `Decrypt TXT : ${fileEncoding}`;
      }
      return "Path file is wrong!";
    } catch (error) {
      throw new Error(error);
    }
  }

  encryptAes256Cbc(fileTextName: string = null) {
    const fileText = fileTextName || "NPA.TXT";
    const fileEnc = `${Date.now()}-ENCRYPTED.enc`;

    //if (fs.existsSync(`${this.pathLocalEnc}${fileText}`)) {
    try {
      const openssl = spawn("openssl", [
        "enc",
        "-aes-256-cbc",
        "-a",
        "-salt",
        //"-in",
        //`${this.pathLocalEnc}${fileText}`,
        "-pass",
        `pass:${this.passCertKey}`,
        // "-out",
        //`${this.pathLocalEnc}${fileEnc}`,
      ]);

      //openssl.unref();

      //-- in open-ssh
      openssl.stdin.write(this.getContent());
      openssl.stdin.end();

      //-- out open-ssh
      openssl.stdout.setEncoding("utf8");
      openssl.stdout.on("data", (data: Buffer) => {
        console.log("OUT DATA: ", data.toString());
        fs.writeFileSync(`/Users/paneet/Desktop/${fileEnc}`, data.toString());
      });

      //-- event open-ssh
      openssl.on("error", (err) => {
        console.log("OUT error: " + err);
      });
      openssl.on("close", (res: any) => {
        console.log("OUT Close", res);
      });
      return "encrypted";
    } catch (error) {
      throw new Error(error);
    }
    //}
  }

  decryptAes256Cbc(fileTextName: string) {
    const fileText = fileTextName || "NPA.TXT";
    const fileEnc = `${Date.now()}-DECRYPTED.TXT`;

    //if (fs.existsSync(`${this.pathLocalEnc}${fileText}`)) {
    try {
      console.log("action");
      const openssl = spawn("openssl", [
        "enc",
        "-aes-256-cbc",
        "-d",
        "-a",
        "-salt",
        "-in",
        `/Users/paneet/Desktop/${fileTextName}`, //`${this.pathLocalEnc}${fileText}`,
        "-pass",
        `pass:${this.passCertKey}`,
        "-out",
        `/Users/paneet/Desktop/${fileEnc}`, //`${this.pathLocalEnc}${fileEnc}`,
      ]);
      //openssl.unref();

      //-- in open-ssh
      //const outFile = fs.createWriteStream(`/Users/paneet/Desktop/${fileTextName}`);
      //openssl.stdin.pipe(outFile);
      //openssl.stdin.write(`/Users/paneet/Desktop/${fileTextName}`);
      //openssl.stdin.end();

      //-- out open-ssh
      //   openssl.stdout.setEncoding("utf8");
      //   openssl.stdout.on("data", (data: Buffer) => {
      //     console.log("DE-OUT DATA: ", data.toString());
      //     //fs.writeFileSync(`/Users/paneet/Desktop/${fileEnc}`, data.toString());
      //   });

      //-- event open-ssh
      //   openssl.on("error", (err) => {
      //     console.log("OUT error: " + err);
      //   });
      //   openssl.on("close", (res: any) => {
      //     console.log("OUT Close", res);
      //   });
      return "decrypted";
    } catch (error) {
      throw new Error(error);
    }
    //}
  }

  getOpenSSL(q: string) {
    const keyCert = "U2FsdGVkX1+gbrkoRfie6caeZ3NM/Xoux0uGQBOiiyY=";
    const fileText = "NPA.TXT";
    const fileEnc = "TEST-NPA.enc";
    const pathEnc = "/Users/paneet/Documents/enc/";
    const timeStamp = Date.now();

    if (q == "de" && fs.existsSync(`${pathEnc}${fileEnc}`)) {
      const openssl = spawn("openssl", [
        "enc",
        "-aes-256-cbc",
        "-d",
        "-a",
        "-salt",
        "-in",
        `${pathEnc}${fileEnc}`,
        "-pass",
        `pass:${keyCert}`,
        "-out",
        `${pathEnc}${timeStamp}-${fileText}`,
      ]);
      return "decyption";
    }

    if (q == "en" && fs.existsSync(`${pathEnc}${fileText}`)) {
      const openssl = spawn("openssl", [
        "enc",
        "-aes-256-cbc",
        "-a",
        "-salt",
        "-in",
        `${pathEnc}${fileText}`,
        "-pass",
        `pass:${keyCert}`,
        "-out",
        `${pathEnc}${fileEnc}`,
      ]);
      return "encypt";
    }
    return "openssl";
  }
}
