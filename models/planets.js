const { int, text, mysqlTable, float } = require("drizzle-orm/mysql-core");

const planetsSchema = mysqlTable("planets", {
    id: int("id").primaryKey().autoincrement(),
    nombre: text("nombre"),
    periodo_rotacion: float("periodo_rotacion"),
    periodo_orbital: float("periodo_orbital"),
    diametro: float("diametro"),
    clima: text("clima"),
    gravedad: text("gravedad"),
    terreno: text("terreno"),
    agua_superficial: text("agua_superficial"),
    poblacion: int("poblacion"),
});

module.exports = { planetsSchema };
