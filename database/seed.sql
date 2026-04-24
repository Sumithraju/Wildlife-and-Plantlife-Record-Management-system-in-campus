-- ============================================================
-- Seed Data – Campus Biodiversity Portal
-- Campus-specific plant and wildlife records
-- ============================================================

-- Default admin password: Admin@123  (bcrypt hash, 12 rounds)
-- Default researcher password: Research@123

TRUNCATE TABLE users, wildlife_records, plant_records, record_images, activity_logs RESTART IDENTITY CASCADE;

INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Admin User', 'admin@campus.edu',       '$2a$12$R0ol663kWALXABcAyfqOR.1MmxN/w0htg/9FuJRSUlN19uZ4esY4y', 'admin'),
  ('Vineeth',    'vineeth@campus.edu',     '$2a$12$tqr6vG4HqdNmwkq2ELxHeOyO723vQwUJe.AeYtiiiYjMf5ZrV07LO', 'researcher'),
  ('Sumithra',   'sumithra@campus.edu',    '$2a$12$tqr6vG4HqdNmwkq2ELxHeOyO723vQwUJe.AeYtiiiYjMf5ZrV07LO', 'researcher'),
  ('Neelesh',    'neelesh@campus.edu',     '$2a$12$tqr6vG4HqdNmwkq2ELxHeOyO723vQwUJe.AeYtiiiYjMf5ZrV07LO', 'researcher'),
  ('Sumirtha',   'sumirtha@campus.edu',    '$2a$12$tqr6vG4HqdNmwkq2ELxHeOyO723vQwUJe.AeYtiiiYjMf5ZrV07LO', 'researcher');

-- Wildlife Records (6 records)
-- user mapping: Vineeth=2, Sumithra=3, Neelesh=4, Sumirtha=5
INSERT INTO wildlife_records (user_id, species_name, common_name, category, observation_date, latitude, longitude, habitat, notes, status) VALUES
  (2, 'Felis catus',              'Cat',          'mammal',  '2026-04-22', 12.844, 77.658, 'Campus ground', 'Spotted on campus grounds', 'verified'),
  (3, 'Canis lupus familiaris',   'Dog',          'mammal',  '2026-04-22', 12.844, 77.659, 'Campus ground', 'Spotted on campus grounds', 'verified'),
  (4, 'Oecophylla smaragdina',    'Red Ant',      'insect',  '2026-04-22', 12.844, 77.657, 'Campus ground', 'Spotted on campus grounds', 'verified'),
  (5, 'Bungarus caeruleus',       'Common Krait', 'reptile', '2026-04-22', 12.844, 77.658, 'Campus ground', 'Spotted on campus grounds', 'pending'),
  (2, 'Rattus rattus',            'Rat',          'mammal',  '2026-04-22', 12.844, 77.659, 'Campus ground', 'Spotted on campus grounds', 'verified'),
  (3, 'Mus musculus',             'House Mouse',  'mammal',  '2026-04-22', 12.844, 77.657, 'Campus ground', 'Spotted on campus grounds', 'verified');

-- Plant Records (33 records)
-- user mapping: Vineeth=2, Sumithra=3, Neelesh=4, Sumirtha=5
INSERT INTO plant_records (user_id, species_name, family, common_name, flowering_season, height_cm, iucn_status, observation_date, latitude, longitude, notes, status) VALUES
  (2, 'Terminalia catappa',          'Combretaceae',    'Indian Almond',              'Mar-May',    2500, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (3, 'Magnolia champaca',           'Magnoliaceae',    'Sampige (Champak)',           'Jun-Oct',    3000, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (4, 'Litchi chinensis',            'Sapindaceae',     'Litchi',                     'Feb-Apr',    1000, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (5, 'Amaranthus viridis',          'Amaranthaceae',   'Amaranthus',                 'Year-round',  100, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (2, 'Hibiscus rosa-sinensis',      'Malvaceae',       'Hibiscus',                   'Year-round',  200, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (4, 'Carica papaya',               'Caricaceae',      'Papaya',                     'Year-round',  600, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (3, 'Mangifera indica',            'Anacardiaceae',   'Mango',                      'Dec-Apr',    2000, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (5, 'Manilkara zapota',            'Sapotaceae',      'Sapota (Chikoo)',             'Feb-Apr',    1500, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (2, 'Musa paradisiaca',            'Musaceae',        'Banana',                     'Year-round',  400, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (4, 'Polyalthia longifolia',       'Annonaceae',      'Indian Umbrella Tree',        'Feb-May',    1500, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (3, 'Monstera deliciosa',          'Araceae',         'Monstera',                   'Year-round',  200, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (5, 'Cissus quadrangularis',       'Vitaceae',        'Veldt Grape',                'Jun-Aug',     150, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (2, 'Phyllanthus emblica',         'Phyllanthaceae',  'Gooseberry (Nelli)',          'Feb-May',     800, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (4, 'Aloe vera',                   'Asphodelaceae',   'Aloe Vera',                  'Year-round',   60, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (3, 'Epipremnum aureum',           'Araceae',         'Money Plant',                'Rare',         200, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (5, 'Ficus carica',                'Moraceae',        'Fig',                        'Mar-May',     800, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (2, 'Ficus religiosa',             'Moraceae',        'Peepal',                     'Mar-Apr',    3000, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (4, 'Citrus limon',                'Rutaceae',        'Lemon',                      'Year-round',  400, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (3, 'Azadirachta indica',          'Meliaceae',       'Neem',                       'Jan-May',    1500, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (5, 'Cocos nucifera',              'Arecaceae',       'Coconut',                    'Year-round', 3000, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (2, 'Capsicum annuum',             'Solanaceae',      'Chilli',                     'Year-round',  100, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (4, 'Saraca asoca',                'Fabaceae',        'Ashoka',                     'Feb-Apr',     900, 'NT', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (3, 'Dracaena trifasciata',        'Asparagaceae',    'Snake Plant',                'Rare',         120, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (5, 'Tecoma stans',                'Bignoniaceae',    'Golden Bell',                'Year-round',  500, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (2, 'Catharanthus roseus',         'Apocynaceae',     'Pink Flower (Periwinkle)',    'Year-round',   60, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (4, 'Jacaranda mimosifolia',       'Bignoniaceae',    'Jacaranda',                  'Apr-Jun',    1500, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (3, 'Swietenia mahagoni',          'Meliaceae',       'Mahogany',                   'May-Jul',    2500, 'NT', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (5, 'Thespesia populnea',          'Malvaceae',       'Indian Tulip',               'Year-round', 1500, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (2, 'Nyctanthes arbor-tristis',    'Oleaceae',        'Parijata',                   'Aug-Oct',     600, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (4, 'Pinus roxburghii',            'Pinaceae',        'Pine',                       'Mar-May',    5000, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified'),
  (3, 'Yucca aloifolia',             'Asparagaceae',    'Yucca',                      'Jun-Sep',     300, 'LC', '2026-04-22', 12.844, 77.658, 'Spotted on campus',  'verified'),
  (5, 'Bambusa vulgaris',            'Poaceae',         'Bamboo',                     'Rare',        2500, 'LC', '2026-04-22', 12.844, 77.659, 'Spotted on campus',  'verified'),
  (2, 'Alocasia macrorrhizos',       'Araceae',         'Giant Taro',                 'Year-round',  300, 'LC', '2026-04-22', 12.844, 77.657, 'Spotted on campus',  'verified');
