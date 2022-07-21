create extension if not exists "uuid-ossp";

--drop table stocks;
--drop table products;

create table products(
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price integer
);

create table stocks(
	product_id uuid not null primary key,
	count integer,
	foreign key ("product_id") references "products" ("id")
);

insert into products (title, description, price) values
('Mineralka', 'Mineralka s gazikami', 400),
('Aquanika', 'Mineral drinking natural-table water', 35),
('Evian', 'Evian is mined in France near the Chablais mountain range.', 100),
('Morshynska Premium', '"Morshinskaya" - mineral natural table water, with a balanced composition, is fully perceived by the body and restores it every day. Water comes from the Morshyn valley, which stretches along the eastern slope of the Carpathian ridge and independently makes its way to the surface of the earth.', 4),
('Morshynka Sport', 'Like "Morshinskaya"! But for the little ones. "Morshynka" is a familiar natural water that is safe for babies to drink from the first days. Born in the protected Morshyn springs of the resort region of the Carpathians, "Morshinka" is easily absorbed by the child body and restores the hydrobalance.', 23),
('Morshynska', '"Morshinskaya" - mineral natural table water, with a balanced composition, is fully perceived by the body and restores it every day. Water comes from the Morshyn valley, which stretches along the eastern slope of the Carpathian ridge and independently makes its way to the surface of the earth.', 2),
('Volzhanka', 'The source of extraction is Undorovsky mineral springs (Russia, Ulyanovsk region). It has a fairly high level of mineralization - 0.8-1.2 g / l. It is considered a full-fledged Russian analogue of the Ukrainian Naftusya medicinal table water, but at the same time it does not have that specific sharp taste that is characteristic of the Truskavets Naftusya. When consumed in the recommended amounts, it does not pose a threat to the violation of the water-salt balance in the body.', 2),
('Morshynska with orange and grapefruit flavor', 'Morshynska with aroma - lightly carbonated natural Morshinska, filled with fresh aromas, light taste of citrus fruits, fruits and berries. Filling, refreshing and so delicious. Tastes better chilled.', 11),
('Sairme', 'Produced in Georgia from high-mountain sources. Although the general level of mineralization in "Sairme" is not high (0.13-0.24 g / l), it belongs to the treatment and prevention, and therefore it is important to comply with the recommended daily volumes of its use.', 55),
('Stelmas', 'Produced in Russia, in the Tula region, extracted from an underground source. Stelmas is considered to be mineral water, but with a very low mineralization level of 0.05 - 0.4 g/l, which makes it suitable for daily consumption in order to quench thirst or replenish fluids in the body.', 17),
('Volvic', 'Produced in France, and mined in the territory of the Auvergne Volcano Park. The level of mineralization is not high - 0.13-0.15 g / l, which is why Volvic can be compared with ordinary water. It quenches thirst well and replenishes the loss of minerals such as magnesium, potassium and sodium.', 25);


insert into stocks (product_id, count) values
('fb528d58-72f7-4026-a99e-daed1653b212', 30),
('9c408149-76d2-418f-9b66-db112f9a7f0e', 115),
('e3c547c5-da0b-4bd2-8684-0970327aba49', 50),
('d789af9a-8590-4b27-a8b6-9e3fc3b4f6eb', 70),
('52bea749-05f1-4eb3-aa15-fac14f430777', 60),
('6bedc776-f9d2-44af-a43a-251ca850c1a9', 4),
('b145ee5c-6026-44d0-bd44-b24a1b1c6685', 200),
('a377fc93-eda8-4a6e-a2d9-a06055607b8b', 25),
('f6a94cad-389a-4bd6-a004-b91419c211c1', 1000),
('35774adf-c3e1-4695-9375-6e8e8b019246', 25),
('8c971973-d4b7-4cf7-817f-377eb02a5bca', 80);


--update products set price = 150 where id = 'fba578b6-cc9a-40d9-b7cb-55a2fdf3c0be';

--delete from products where id = '135f101c-efd9-434d-86a1-2d386c003ae4';

--select p.id, p.title, p.description, p.price, s.count
--from products as p
--inner join
--stocks as s
--on p.id = s.product_id




