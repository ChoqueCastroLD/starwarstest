CREATE TABLE `planets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` text,
	`periodo_rotacion` float,
	`periodo_orbital` float,
	`diametro` float,
	`clima` text,
	`gravedad` text,
	`terreno` text,
	`agua_superficial` text,
	`poblacion` int,
	CONSTRAINT `planets_id` PRIMARY KEY(`id`)
);
