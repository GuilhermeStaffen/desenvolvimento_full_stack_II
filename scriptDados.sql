INSERT INTO users (
  id, name, password, email, "userType", "createdAt", "updatedAt",
  phone, street, number, city, state, zipcode, country
)
VALUES
(1, 'guilherme up1', '$2b$10$TsidMqmiEGEdXT/tcD.Lzui1PGhngarPklHVPz90uEia3x9sElDVq', 'guilherme1@novogmail.com', 'customer', '2025-09-05 01:43:31.080+00', '2025-09-10 23:12:02.395+00', NULL, '', '', '', '', '', ''),
(2, 'Guilherme 21', '$2b$10$cro3BdyJKrkm3eKWP25NOudMPvS44v5dcYk4a/QSZXShq8IxeygIC', 'guilherme2@gmail.com', 'admin', '2025-09-05 01:43:41.638+00', '2025-09-27 13:22:48.635+00', '51987654321', 'teste', '123', 'taquara', 'rs', '95600000', 'BR'),
(3, 'iasmin', 'iasmin123', 'iasminhahn@sou.faccat.br', 'customer', '2025-09-17 23:30:20.553+00', '2025-09-17 23:30:20.553+00', NULL, '', '', '', '', '', ''),
(4, 'Guilherme3', '$2b$10$tc6.G50fDbNdfzReTKaliO7MYlA6XAB6kUQTQNBE7fShnaE8Y5ki6', 'guilherme3@gmail.com', 'customer', '2025-09-10 23:06:40.205+00', '2025-09-25 23:23:05.753+00', '1236664', 'teste1', '1234', 'taquara1', 'rs1', '956000001', 'BRt'),
(5, 'Guilherme3', '$2b$10$wGgVlW0j6AyewLoynmHRbOXjlP4rwJ6HP/NpNW5G9FIWUrgdYuejK', 'guilherme4@gmail.com', 'customer', '2025-09-11 01:16:05.387+00', '2025-09-11 01:16:05.387+00', '51998556633', 'asdsa', '123', 'campo bom', 'rsad', '123123123', 'vwqeq'),
(6, 'Teste', '$2b$10$B5HONrH4wBEOzfVLuhZw4.QwEsT5KSxZWB96Ti81uelonhllcAtaK', 'teste@gmail.com', 'customer', '2025-09-17 23:30:20.553+00', '2025-09-17 23:30:20.553+00', '55 51 980566184', 'Pastor homero severo pinto', '4539', 'taquara', 'rs', '95612720', 'BR'),
(7, 'Iasmin Hahn ', '$2b$10$7wenfPtPX6hK1TarbYrJ5.bYjS69OEO0LGOsSwi1otgFjIvoSAWF2', 'iasminhahnoliveira@gmail.com', 'customer', '2025-09-17 23:34:18.831+00', '2025-09-17 23:34:18.831+00', '5551980566184', 'Pastor H S P', '4539', 'Taquara', 'RS', '95612720', 'BR'),
(8, 'Teste da silva', '$2b$10$VMsdP/C7cl2zzHW16eM6aOuJF2kyGgG1WmiOQszNKelTJHU/My65q', 'teste2@gmail.com', 'admin', '2025-09-17 23:37:34.955+00', '2025-09-17 23:37:34.955+00', '5551987654321', 'teste', '123', 'test', 'tr', '95612700', 'rs'),
(9, 'douglas bedin', '$2b$10$I4uaixYaN8VybghayyneGeJ15Xo7BcQs2HygpYJw7MPXT2wK.1tt2', 'douglas_bedin@hotmail.com', 'customer', '2025-09-17 23:44:17.824+00', '2025-09-17 23:44:17.824+00', '+5551997699177', 'shalow', '56', 'aracaju', 'acre', '86900000', 'brasil'),
(10, 'Novo Usuario', '$2b$10$Kp7VRHpO5b5J.80uY/M70uQRZawVW6XY.sZ57QA235ooAweeCSx3W', 'novousuario@gmail.com', 'customer', '2025-09-28 18:37:34.112+00', '2025-09-28 18:37:34.112+00', '51997695888', 'Rua Teste', '144', 'Campo Bom', 'RS', '93700000', 'Brasil');



INSERT INTO suppliers (id, name, email, website, cnpj, phone, createdBy, updatedBy, createdAt, updatedAt) VALUES
(6, 'Fornecedor 12', 'fornecedor1@gmail.com', '', '038895665', '51997586355', 8, 8, '2025-10-24 12:49:26.131', '2025-10-24 12:51:42.489'),
(7, 'Fornecedor 2', 'fornecedor2@gmail.com', NULL, '123', '51997586355', 8, 8, '2025-10-24 12:49:34.033', '2025-10-24 12:49:34.033'),
(8, 'Fornecedor 3', 'fornecedor3@gmail.com', NULL, '123124455141235645', '51997586355123', 8, 8, '2025-10-24 12:50:21.200', '2025-10-24 12:50:21.200'),
(9, 'Fornecedor 4', 'fornecedor4@gmail.com', NULL, '04121349999932', '51997586123', 8, 8, '2025-10-24 12:50:36.685', '2025-10-24 12:50:36.685'),
(10, 'Fornecedor 5', 'fornecedor5@gmail.com', NULL, '12321', '5199758635511', 8, 8, '2025-10-24 12:51:01.281', '2025-10-24 12:51:01.281'),
(11, 'Fornecedor 6', 'fornecedor6@gmail.com', NULL, '0410123999932', '51997586355199', 8, 8, '2025-10-24 12:51:16.073', '2025-10-24 12:51:16.073'),
(12, 'Fornecedor 7', 'fornecedor7@gmail.com', NULL, '0410991231111199932', '519975863556766', 8, 8, '2025-10-24 12:51:33.658', '2025-10-24 12:51:33.658');


INSERT INTO products (id, name, price, quantity, createdBy, updatedBy, createdAt, updatedAt, description) VALUES
(1, 'Isca Artificial Marine Sports', 50.5, 35, 2, 8, '2025-09-05 01:44:13.867', '2025-10-29 14:53:46.666', 'A Isca Marine Sports SAVAGE é um projeto baseado na X-RAP da Rapala mas com enorme custo benefício!
Ela já vem equipada com garatéias reforçadas vermelhas seguindo uma tendência do mercado e é a grande proposta para iscas de meia água e de fácil trabalho, basta recolhe-la com toques de ponta de vara para que execute um trabalho irresistível para a maioria dos predadores como tucunarés, dourados, tabaranas, cachorras, matrinhãs, traíras, anchovas, badejos, robalos, etc...
Especificações:
Ação: meia-água (Floating)
Tamanho: 8,5cm
Peso: 9gr
Profundidade: 0,80 - 1,50m
Isca com efeito rattlin;'),
(2, 'Linha Multifilamento 100m', 23.0, 38, 2, 8, '2025-09-05 01:44:45.815', '2025-10-24 11:58:34.286', 'Eleve sua experiência de pesca esportiva com a Linha Multifilamento Ultra Line 4x TR Fishing, projetada para oferecer máxima resistência, durabilidade excepcional e desempenho confiável em todas as condições. Ideal para pescadores que exigem precisão e força, esta linha multifilamento de alta qualidade é uma escolha certeira para capturas desafiadoras.'),
(3, 'Anzóis 5 Un', 10.0, 4, 2, 8, '2025-09-10 23:16:55.167', '2025-10-29 14:53:52.508', 'Descubra nossa seleção de anzol de pesca ENCASTOADO'),
(4, 'Vara Pro Chompers', 190.0, 2, 2, 8, '2025-09-10 23:19:35.451', '2025-10-24 13:04:21.714', 'Desempenho, precisão e resistência em cada arremesso.'),
(5, 'Alicate 21kg', 10.0, 9, 2, 8, '2025-09-10 23:20:20.354', '2025-10-29 14:54:49.553', 'Alicate Pesca Brasil Garra, o lider de vendas.'),
(6, 'Passaguá Dobrável G', 85.0, 20, 2, 2, '2025-09-10 23:20:36.441', '2025-10-29 14:54:49.561', 'Passaguá dobrável feito todo em alumínio, cabo de 75cm'),
(8, 'Bolsa de pesca Shimaono', 800.0, 5, 2, 2, '2025-09-10 23:21:09.628', '2025-10-29 14:56:13.447', 'Acessório indispensável para todas as pescarias'),
(9, 'Maleta Pesca', 650.0, 2, 2, 2, '2025-09-11 00:02:53.935', '2025-09-28 18:53:12.478', 'Com compartimento Superior Fechamento com Travas'),
(10, 'Carretilha Perfil Alto', 400.0, 15, 2, 2, '2025-09-17 22:23:38.406', '2025-09-28 18:33:23.197', 'A Carretilha de pesca Perfil Alto Omega da Albatroz Fishing é a escolha perfeita para os pescadores que buscam desempenho e durabilidade. Projetada para diversas modalidades de pesca, como praia, rio, lagoa, plataforma, oceânica e pesqueiro, esta carretilha oferece versatilidade e eficiência para todos os tipos de pescaria.'),
(11, 'Boné Spirit Saint', 70.0, 10, 2, 2, '2025-09-28 18:55:11.146', '2025-09-28 18:55:11.146', 'O Boné de Pesca Spirit Saint é a escolha perfeita para pescadores que desejam expressar seu estilo em qualquer ocasião. Confeccionado com tecido 100% poliéster, este boné combina conforto, durabilidade e um design moderno, tornando-se ideal para uso tanto nas suas aventuras de pesca quanto em atividades cotidianas.');


INSERT INTO product_images (id, url, productId, createdAt, updatedAt) VALUES
(1, 'https://cdn.awsli.com.br/800x800/2674/2674193/produto/2437639861d9a8c27df.jpg', 1, '2025-09-28 18:29:32.472', '2025-09-28 18:29:32.472'),
(2, 'https://dcdn-us.mitiendanube.com/stores/003/983/415/products/carretilha-perfil-alto-omega-40-50-60-80-albatroz-fishing-977a073663df1684fa17223468474961-1024-1024.webp', 10, '2025-09-28 18:33:23.214', '2025-09-28 18:33:23.214'),
(3, 'https://dcdn-us.mitiendanube.com/stores/003/983/415/products/carretilha-perfil-alto-omega-40-50-60-80-albatroz-fishing-lado1-c47e05d85c6cc1352f17223468474573-1024-1024.webp', 10, '2025-09-28 18:33:23.224', '2025-09-28 18:33:23.224'),
(4, 'https://dcdn-us.mitiendanube.com/stores/003/983/415/products/linha-tr-fishing-4x-multifilamento-ultra-line-beb0e32ec705ada29b17522576524414-1024-1024.png', 2, '2025-09-28 18:46:47.272', '2025-09-28 18:46:47.272'),
(5, 'https://dcdn-us.mitiendanube.com/stores/003/983/415/products/linha-multifilamento-4x-100m-trfishing-verde-c836cb09c7c6d78b6517317047504842-1024-1024.jpg', 2, '2025-09-28 18:46:47.283', '2025-09-28 18:46:47.283'),
(7, 'https://dcdn-us.mitiendanube.com/stores/003/983/415/products/78a8e15e-186b-43f0-b63d-08963812b1e0-4d998236e4b8b6398a17523679600578-1024-1024.webp', 4, '2025-09-28 18:48:41.885', '2025-09-28 18:48:41.885'),
(8, 'https://images.tcdn.com.br/img/img_prod/813805/alicate_de_contencao_garra_c_balanca_21kg_pesca_brasil_493_1_20220212192159.jpg', 5, '2025-09-28 18:49:43.744', '2025-09-28 18:49:43.744'),
(9, 'https://images.tcdn.com.br/img/img_prod/415086/passagua_dobravel_363_1_20230727144353.jpg', 6, '2025-09-28 18:51:17.833', '2025-09-28 18:51:17.833'),
(10, 'https://images.tcdn.com.br/img/img_prod/340075/bolsa_de_pesca_shimano_baltica_tackle_bag_tamanho_g_21750_1_6dc269f8bbb4cd80e3f835a75cbf636c.jpg', 8, '2025-09-28 18:52:27.625', '2025-09-28 18:52:27.625'),
(11, 'https://images.tcdn.com.br/img/img_prod/685751/maleta_de_pesca_pioneer_372917_37x29x17cm_2_estojos_35859_1_9b2ef08a9e128b29c02340bb4766ed9f_20250918024105.jpg', 9, '2025-09-28 18:53:12.487', '2025-09-28 18:53:12.487'),
(12, 'https://dcdn-us.mitiendanube.com/stores/003/983/415/products/bone-pesca-spirit-vermelho-saint-lado-fd5176d7520f11316017207957309842-1024-1024.webp', 11, '2025-09-28 18:55:11.159', '2025-09-28 18:55:11.159'),
(13, 'https://images.tcdn.com.br/img/img_prod/1120290/anzol_chinu_black_com_encastoado_rigido_boias_barao_5_unidades_2989_1_487c0daf15644e98e69708225d2084d4.jpg', 3, '2025-10-24 11:59:57.267', '2025-10-24 11:59:57.267');

INSERT INTO orders (id, userId, status, total, createdAt, updatedAt, fullAddress) VALUES
(1, 5, 'canceled', 30.0, '2025-09-11 01:20:56.738', '2025-09-25 23:41:31.145', 'asdsa, 123, campo bom, rsad, 123123123, vwqeq'),
(2, 2, 'delivered', 50.0, '2025-09-15 23:21:18.204', '2025-10-29 14:47:48.222', ', , , , , '),
(3, 2, 'canceled', 10.0, '2025-09-16 23:27:00.965', '2025-09-25 23:56:57.171', ', , , , , '),
(4, 2, 'canceled', 20.0, '2025-09-17 00:46:06.515', '2025-09-25 23:58:27.348', 'teste, 123, taquara, rs, 95600000, BR'),
(5, 2, 'shipped', 10.0, '2025-09-25 00:54:10.504', '2025-09-25 23:58:31.166', 'teste1, 1234, taquara1, rs1, 956000001, BRt'),
(6, 2, 'placed', 30.0, '2025-09-25 23:49:08.679', '2025-09-25 23:49:08.679', 'teste1, 1234, taquara1, rs1, 956000001, BRt'),
(7, 2, 'placed', 10.0, '2025-09-25 23:49:24.066', '2025-09-25 23:49:24.066', 'teste1, 1234, taquara1, rs1, 956000001, BRt'),
(8, 2, 'placed', 20.0, '2025-09-28 18:11:45.794', '2025-09-28 18:11:45.794', 'teste, 123, taquara, rs, 95600000, BR'),
(9, 2, 'delivered', 10.0, '2025-09-28 18:13:02.304', '2025-10-29 14:53:37.849', 'teste, 123, taquara, rs, 95600000, BR'),
(10, 8, 'delivered', 50.5, '2025-10-29 14:25:41.404', '2025-10-29 14:47:51.649', 'teste, 123, test, tr, 95612700, rs'),
(11, 8, 'delivered', 50.5, '2025-10-29 14:53:46.674', '2025-10-29 14:54:27.890', 'teste, 123, test, tr, 95612700, rs'),
(12, 8, 'delivered', 10.0, '2025-10-29 14:53:52.515', '2025-10-29 14:54:23.659', 'teste, 123, test, tr, 95612700, rs'),
(13, 8, 'delivered', 95.0, '2025-10-29 14:54:49.568', '2025-10-29 14:54:57.421', 'teste, 123, test, tr, 95612700, rs'),
(14, 8, 'canceled', 800.0, '2025-10-29 14:56:13.453', '2025-10-29 14:56:23.593', 'teste, 123, test, tr, 95612700, rs');

INSERT INTO order_items (id, orderId, productId, quantity, unitPrice, subtotal) VALUES
(1, 1, 2, 2, 10.0, 20.0),
(2, 1, 1, 1, 10.0, 10.0),
(3, 2, 2, 4, 10.0, 40.0),
(4, 2, 1, 1, 10.0, 10.0),
(5, 3, 9, 1, 10.0, 10.0),
(6, 4, 5, 2, 10.0, 20.0),
(7, 5, 1, 1, 10.0, 10.0),
(8, 6, 1, 3, 10.0, 30.0),
(9, 7, 1, 1, 10.0, 10.0),
(10, 8, 3, 1, 10.0, 10.0),
(11, 8, 1, 1, 10.0, 10.0),
(12, 9, 2, 1, 10.0, 10.0),
(13, 10, 1, 1, 50.5, 50.5),
(14, 11, 1, 1, 50.5, 50.5),
(15, 12, 3, 1, 10.0, 10.0),
(16, 13, 5, 1, 10.0, 10.0),
(17, 13, 6, 1, 85.0, 85.0),
(18, 14, 8, 1, 800.0, 800.0);

INSERT INTO cart (id, userId, productId, quantity, createdAt, updatedAt) VALUES
(5, 4, 3, 2, '2025-09-26 00:12:09.357+00', '2025-09-26 00:21:03.725+00'),
(8, 4, 2, 1, '2025-09-26 00:21:34.907+00', '2025-09-30 21:29:41.264+00'),
(9, 2, 1, 2, '2025-09-30 21:29:53.090+00', '2025-09-30 21:29:55.198+00'),
(10, 2, 2, 1, '2025-09-30 21:29:57.055+00', '2025-09-30 21:29:57.055+00'),
(11, 2, 3, 1, '2025-09-30 21:30:08.714+00', '2025-09-30 21:30:08.714+00');

update products set costPrice = price * 0.6 where costPrice is 0;

UPDATE order_items
SET unitPrice = (
    SELECT price 
    FROM products 
    WHERE products.id = order_items.productId
);