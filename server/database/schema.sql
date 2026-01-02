CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(75) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL
);


CREATE TABLE trip (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  start_at DATE,
  end_at DATE,
  user_id INT NOT NULL,
  CONSTRAINT fk_trip_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
);

CREATE TABLE destination (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  trip_id INT NOT NULL,
  CONSTRAINT fk_destination_trip
    FOREIGN KEY (trip_id) REFERENCES trip(id)
    ON DELETE CASCADE
);

CREATE TABLE category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  label VARCHAR(80) NOT NULL
);


CREATE TABLE budget (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(6,2) NOT NULL,
  is_mandatory BOOLEAN NOT NULL,
  trip_id INT NOT NULL,
  category_id INT NOT NULL,
  CONSTRAINT fk_budget_trip
    FOREIGN KEY (trip_id) REFERENCES trip(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_budget_category
    FOREIGN KEY (category_id) REFERENCES category(id)
    ON DELETE RESTRICT
);

CREATE TABLE participate (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(10) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  trip_id INT NOT NULL,
  CONSTRAINT fk_participate_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_participate_trip
    FOREIGN KEY (trip_id) REFERENCES trip(id)
    ON DELETE CASCADE
);

CREATE TABLE vote (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  destination_id INT NOT NULL,
  CONSTRAINT fk_vote_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_vote_destination
    FOREIGN KEY (destination_id) REFERENCES destination(id)
    ON DELETE CASCADE
);

insert into user(id, firstname, lastname, email, password)
values
  (1, "Jack", "DUPONT", "jdoe@mail.com", "123456");

insert into trip(id, title, description, start_at, end_at, user_id)
values
  (1, "Venezuela", "vamos a la playa", "2026-04-01", "2026-05-01", 1),
  (2, "Spring break chez Cindy", "Villa à Antibes", "2026-07-01", "2026-08-01", 1);
