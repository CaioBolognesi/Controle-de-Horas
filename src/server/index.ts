import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import electron from "electron";

export default function startServer() {
  const userDataPath = electron.app.getPath("userData");
  const app = express();
  const PORT = 3000;

  app.use(bodyParser.json());
  app.use(express.static(path.join(userDataPath, "public")));
  app.post("/submit", (req, res) => {
    const data = req.body;

    const company = data.company;
    const employee = data.employee;
    const days = data.days || [];

    const totalHours = calculateTotalHours(days);

    const filePath = path.join(userDataPath, "horas_trabalhadas.xlsx");

    let workbook;
    let worksheet;
    let worksheetData;

    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets["Horas Trabalhadas"];
      worksheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } else {
      workbook = XLSX.utils.book_new();
      worksheetData = [
        ["Empresa", "Funcionário", "Dias Trabalhados", "Total de Horas"],
      ];
      worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Horas Trabalhadas");
    }

    worksheetData.push([company, employee, days.join(", "), totalHours]);

    const updatedWorksheet = XLSX.utils.aoa_to_sheet(worksheetData as any);
    workbook.Sheets["Horas Trabalhadas"] = updatedWorksheet;

    XLSX.writeFile(workbook, filePath);

    res.json({ totalHours });
  });

  function calculateTotalHours(days: string[]) {
    const weekdays = ["segunda", "terça", "quarta", "quinta"];
    const fridaySaturday = ["sexta", "sábado"];

    let totalHours = 0;

    days.forEach(function (day) {
      if (weekdays.includes(day)) {
        totalHours += 10;
      } else if (fridaySaturday.includes(day)) {
        totalHours += 9;
      }
    });

    return totalHours;
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
