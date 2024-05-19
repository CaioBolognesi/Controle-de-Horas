"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const xlsx_1 = __importDefault(require("xlsx"));
const electron_1 = __importDefault(require("electron"));
function startServer() {
    const userDataPath = electron_1.default.app.getPath("userData");
    const app = (0, express_1.default)();
    const PORT = 3000;
    app.use(body_parser_1.default.json());
    app.use(express_1.default.static(path_1.default.join(userDataPath, "public")));
    app.post("/submit", (req, res) => {
        const data = req.body;
        const company = data.company;
        const employee = data.employee;
        const days = data.days || [];
        const totalHours = calculateTotalHours(days);
        const filePath = path_1.default.join(userDataPath, "horas_trabalhadas.xlsx");
        let workbook;
        let worksheet;
        let worksheetData;
        if (fs_1.default.existsSync(filePath)) {
            workbook = xlsx_1.default.readFile(filePath);
            worksheet = workbook.Sheets["Horas Trabalhadas"];
            worksheetData = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1 });
        }
        else {
            workbook = xlsx_1.default.utils.book_new();
            worksheetData = [
                ["Empresa", "Funcionário", "Dias Trabalhados", "Total de Horas"],
            ];
            worksheet = xlsx_1.default.utils.aoa_to_sheet(worksheetData);
            xlsx_1.default.utils.book_append_sheet(workbook, worksheet, "Horas Trabalhadas");
        }
        worksheetData.push([company, employee, days.join(", "), totalHours]);
        const updatedWorksheet = xlsx_1.default.utils.aoa_to_sheet(worksheetData);
        workbook.Sheets["Horas Trabalhadas"] = updatedWorksheet;
        xlsx_1.default.writeFile(workbook, filePath);
        res.json({ totalHours });
    });
    function calculateTotalHours(days) {
        const weekdays = ["segunda", "terça", "quarta", "quinta"];
        const fridaySaturday = ["sexta", "sábado"];
        let totalHours = 0;
        days.forEach(function (day) {
            if (weekdays.includes(day)) {
                totalHours += 10;
            }
            else if (fridaySaturday.includes(day)) {
                totalHours += 9;
            }
        });
        return totalHours;
    }
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}
exports.default = startServer;
