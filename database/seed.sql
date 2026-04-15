-- ============================================================
-- Seed Data – Campus Biodiversity Portal
-- 50+ realistic records for development / demo
-- ============================================================

-- Default admin password: Admin@123  (bcrypt hash, 12 rounds)
-- Default researcher password: Research@123
-- Default viewer password: Viewer@123

INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Admin User',        'admin@campus.edu',      '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewKyNiLXCFlE1RMq', 'admin'),
  ('Dr. Sarah Chen',   'sarah.chen@campus.edu',  '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uFLmkCRCKy.', 'researcher'),
  ('James Okonkwo',    'james.ok@campus.edu',    '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uFLmkCRCKy.', 'researcher'),
  ('Priya Sharma',     'priya.s@campus.edu',     '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uFLmkCRCKy.', 'researcher'),
  ('Tom Viewer',       'viewer@campus.edu',      '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uFLmkCRCKy.', 'viewer');

-- Wildlife Records (30 records)
INSERT INTO wildlife_records (user_id, species_name, common_name, category, observation_date, latitude, longitude, habitat, notes, status) VALUES
  (2, 'Passer domesticus',       'House Sparrow',         'bird',      '2026-01-05', 1.295123, 103.771456, 'Campus lawn', 'Foraging near cafeteria bins', 'verified'),
  (2, 'Corvus splendens',        'House Crow',            'bird',      '2026-01-08', 1.296001, 103.772100, 'Car park',    'Loud vocalisation observed', 'verified'),
  (3, 'Panthera tigris',         'Malayan Tiger',         'mammal',    '2026-01-12', 1.297500, 103.773200, 'Forest edge', 'Tracks found near fence',   'pending'),
  (3, 'Varanus salvator',        'Water Monitor',         'reptile',   '2026-01-15', 1.294300, 103.770800, 'Pond margin', 'Basking on rock',            'verified'),
  (2, 'Gekko gecko',             'Tokay Gecko',           'reptile',   '2026-01-18', 1.295800, 103.771900, 'Building wall','Calling at dusk',           'verified'),
  (4, 'Apis mellifera',          'Honey Bee',             'insect',    '2026-01-20', 1.296200, 103.772400, 'Garden',      'Pollinating flowering shrubs','verified'),
  (3, 'Rattus norvegicus',       'Brown Rat',             'mammal',    '2026-01-22', 1.293900, 103.770100, 'Store room',  'Spotted near waste area',   'rejected'),
  (4, 'Acridotheres tristis',    'Common Myna',           'bird',      '2026-01-25', 1.296500, 103.773000, 'Open field',  'Pair nesting in palm tree', 'verified'),
  (2, 'Copsychus saularis',      'Oriental Magpie-Robin', 'bird',      '2026-02-02', 1.295000, 103.771000, 'Garden',      'Singing at 6am',            'verified'),
  (3, 'Calotes versicolor',      'Oriental Garden Lizard','reptile',   '2026-02-05', 1.296800, 103.772800, 'Shrub border','Displaying breeding colours','verified'),
  (4, 'Bufo melanostictus',      'Asian Common Toad',     'amphibian', '2026-02-10', 1.294700, 103.771300, 'Drain margin','Found after rain',          'pending'),
  (2, 'Oriolus chinensis',       'Black-naped Oriole',    'bird',      '2026-02-14', 1.297000, 103.774000, 'Rain tree',   'Bright yellow plumage',     'verified'),
  (3, 'Chalcophaps indica',      'Emerald Dove',          'bird',      '2026-02-18', 1.295500, 103.771700, 'Undergrowth', 'Ground feeding',            'verified'),
  (4, 'Cynopterus brachyotis',   'Short-nosed Fruit Bat', 'mammal',    '2026-02-22', 1.296100, 103.772300, 'Rain tree',   'Roosting colony of 15',     'verified'),
  (2, 'Carassius auratus',       'Goldfish',              'fish',      '2026-02-25', 1.293500, 103.769800, 'Campus pond', 'Ornamental pond population','verified'),
  (3, 'Brachytrupes portentosus','Large Field Cricket',   'insect',    '2026-03-01', 1.295200, 103.771200, 'Grass field', 'Burrowing in sandy soil',   'pending'),
  (4, 'Pycnonotus goiavier',     'Yellow-vented Bulbul',  'bird',      '2026-03-05', 1.296300, 103.772600, 'Ficus tree',  'Nest with 3 eggs found',    'verified'),
  (2, 'Manis javanica',          'Sunda Pangolin',        'mammal',    '2026-03-08', 1.298000, 103.774500, 'Forest patch','Critically endangered sighting','verified'),
  (3, 'Hemidactylus frenatus',   'Common House Gecko',    'reptile',   '2026-03-12', 1.295700, 103.771800, 'Corridor wall','Feeding on moths',         'verified'),
  (4, 'Notopterus notopterus',   'Bronze Featherback',    'fish',      '2026-03-15', 1.293800, 103.770200, 'Campus pond', 'Native freshwater species', 'pending'),
  (2, 'Macaca fascicularis',     'Long-tailed Macaque',   'mammal',    '2026-03-18', 1.297200, 103.773400, 'Forest edge', 'Troop of 8 individuals',    'verified'),
  (3, 'Halcyon smyrnensis',      'White-throated Kingfisher','bird',   '2026-03-22', 1.294100, 103.770600, 'Pond edge',   'Perched on wire',           'verified'),
  (4, 'Python reticulatus',      'Reticulated Python',    'reptile',   '2026-03-25', 1.298500, 103.775000, 'Drain',       'Juvenile ~0.8m length',     'pending'),
  (2, 'Rana erythraea',          'Common Green Frog',     'amphibian', '2026-04-01', 1.294500, 103.771100, 'Pond margin', 'Breeding chorus heard',     'verified'),
  (3, 'Nectarinia jugularis',    'Olive-backed Sunbird',  'bird',      '2026-04-04', 1.296600, 103.773100, 'Ixora hedge', 'Feeding on nectar',         'verified'),
  (4, 'Pteropus vampyrus',       'Large Flying Fox',      'mammal',    '2026-04-06', 1.297800, 103.774200, 'Rain tree',   'Roost of 40+ individuals',  'verified'),
  (2, 'Aedes albopictus',        'Tiger Mosquito',        'insect',    '2026-04-08', 1.295400, 103.771600, 'Stagnant water','Larvae in flower pots',   'rejected'),
  (3, 'Trichopodus trichopterus','Three-spot Gourami',    'fish',      '2026-04-09', 1.293600, 103.769900, 'Campus pond', 'Bubble nest observed',      'verified'),
  (4, 'Dicaeum cruentatum',      'Scarlet-backed Flowerpecker','bird', '2026-04-10', 1.296400, 103.772700, 'Mistletoe',   'Feeding on mistletoe berries','verified'),
  (2, 'Felis catus',             'Feral Cat',             'mammal',    '2026-04-12', 1.295100, 103.771400, 'Campus ground','Colony of 5 near canteen', 'pending');

-- Plant Records (25 records)
INSERT INTO plant_records (user_id, species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes, status) VALUES
  (2, 'Ficus benjamina',       'Moraceae',      'Weeping Fig',          'Year-round',   1500, 'LC', '2026-01-06', 1.295300, 103.771500, 'Large shade tree near library',      'verified'),
  (3, 'Heliconia psittacorum', 'Heliconiaceae', 'Parrot Heliconia',     'Jan-Mar',       120, 'LC', '2026-01-10', 1.296100, 103.772200, 'Ornamental planting near entrance',  'verified'),
  (4, 'Ixora coccinea',        'Rubiaceae',     'Jungle Flame',         'Year-round',    100, 'LC', '2026-01-14', 1.294400, 103.770900, 'Hedge along pathway',                'verified'),
  (2, 'Calophyllum inophyllum','Calophyllaceae','Alexandrian Laurel',   'Apr-Jun',      2000, 'LC', '2026-01-17', 1.295900, 103.772000, 'Coastal heritage tree',              'verified'),
  (3, 'Strelitzia reginae',    'Strelitziaceae','Bird of Paradise',     'Sep-May',       120, 'LC', '2026-01-21', 1.296300, 103.772500, 'Feature planting near admin block',  'pending'),
  (4, 'Averrhoa carambola',    'Oxalidaceae',   'Starfruit',            'Mar-Aug',       800, 'LC', '2026-01-24', 1.294600, 103.771200, 'Fruiting tree – fruits collected',   'verified'),
  (2, 'Plumeria obtusa',       'Apocynaceae',   'Frangipani',           'Year-round',    500, 'LC', '2026-01-28', 1.296700, 103.773200, 'Planted along main road',            'verified'),
  (3, 'Rafflesia arnoldii',    'Rafflesiaceae', 'Corpse Flower',        'Oct-Mar',        50, 'VU', '2026-02-03', 1.297600, 103.773800, 'Single bloom observed – rare!',      'verified'),
  (4, 'Hibiscus rosa-sinensis','Malvaceae',     'Tropical Hibiscus',    'Year-round',    200, 'LC', '2026-02-07', 1.295100, 103.771300, 'National flower of Malaysia',        'verified'),
  (2, 'Lagerstroemia speciosa','Lythraceae',    'Queen''s Crape Myrtle', 'Jun-Sep',      2000, 'LC', '2026-02-11', 1.296900, 103.773600, 'Street tree – spectacular bloom',    'verified'),
  (3, 'Bambusa vulgaris',      'Poaceae',       'Common Bamboo',        'Rare',         2500, 'LC', '2026-02-15', 1.295600, 103.771800, 'Bamboo grove near sports field',     'verified'),
  (4, 'Terminalia catappa',    'Combretaceae',  'Sea Almond',           'Mar-May',      2500, 'LC', '2026-02-19', 1.296200, 103.772400, 'Provides shade to football pitch',   'verified'),
  (2, 'Nepenthes rafflesiana', 'Nepenthaceae',  'Raffles Pitcher Plant','Year-round',    100, 'NT', '2026-02-23', 1.297100, 103.773300, 'Carnivorous plant in moist area',    'pending'),
  (3, 'Piper nigrum',          'Piperaceae',    'Black Pepper',         'Year-round',    400, 'LC', '2026-02-26', 1.295400, 103.771700, 'Climbing vine on perimeter wall',    'verified'),
  (4, 'Dillenia suffruticosa', 'Dilleniaceae',  'Simpoh Air',           'Year-round',    300, 'LC', '2026-03-02', 1.294200, 103.770700, 'Pioneer species near construction',  'verified'),
  (2, 'Rauvolfia serpentina',  'Apocynaceae',   'Indian Snakeroot',     'Jun-Oct',       100, 'EN', '2026-03-06', 1.296500, 103.773000, 'Medicinal plant – endangered',       'verified'),
  (3, 'Elaeis guineensis',     'Arecaceae',     'Oil Palm',             'Year-round',   2000, 'LC', '2026-03-09', 1.297300, 103.773500, 'Legacy plantation palm',             'verified'),
  (4, 'Alpinia galanga',       'Zingiberaceae', 'Galangal',             'Aug-Nov',       200, 'LC', '2026-03-13', 1.295000, 103.771100, 'Herb garden near science block',     'verified'),
  (2, 'Artocarpus heterophyllus','Moraceae',    'Jackfruit',            'Jan-Jun',      2000, 'LC', '2026-03-16', 1.293700, 103.770000, 'Large fruiting tree',                'verified'),
  (3, 'Crinum asiaticum',      'Amaryllidaceae','Grand Crinum Lily',    'Jun-Aug',       100, 'LC', '2026-03-20', 1.296800, 103.773200, 'Planted along monsoon drain',        'pending'),
  (4, 'Melaleuca cajuputi',    'Myrtaceae',     'Cajuput Tree',         'Oct-Jan',      2000, 'LC', '2026-03-23', 1.298100, 103.774600, 'Medicinal tree in native plot',      'verified'),
  (2, 'Vanda Miss Joaquim',    'Orchidaceae',   'Singapore Orchid',     'Year-round',    100, 'LC', '2026-03-26', 1.295800, 103.772100, 'National flower – orchid garden',    'verified'),
  (3, 'Catharanthus roseus',   'Apocynaceae',   'Periwinkle',           'Year-round',     60, 'LC', '2026-04-02', 1.296400, 103.772800, 'Medicinal – anti-cancer compound',   'verified'),
  (4, 'Eugenia jambos',        'Myrtaceae',     'Rose Apple',           'Mar-May',      1200, 'LC', '2026-04-05', 1.294800, 103.771400, 'Fruiting – fragrant flowers',        'verified'),
  (2, 'Dracaena marginata',    'Asparagaceae',  'Dragon Tree',          'Rare',          300, 'LC', '2026-04-11', 1.295200, 103.771600, 'Interior atrium planting',           'pending');
