INSERT INTO Employee VALUES (1, 'Diogo Alves da Cruz', '11111111111', null, '2001-03-05', '22999999999', md5('12345678'), 1),
(2, 'Rodrigo Santos Oliveira', '22222222222', null, '2002-06-27', '22999999999', md5('12345678'), 1),
(3, 'João Mayall', '33333333333', null, '2002-07-06', '22999999999', md5('12345678'), 0);

INSERT INTO Patient VALUES(1, 'Angelo Pompeu', '2003-12-24', '11122233344', '', '22999999999'),
(2, 'Leonan Levy', '2003-02-12', '22211133344', '', '22999999999');

INSERT INTO Room VALUES(1, 'Consultório 1'),
(2, 'Consultório 2'),
(3, 'Consultório 3');

INSERT INTO Schedule VALUES(DEFAULT, 1, '08:00:00', '15:00:00', 3, 3),
(DEFAULT, 2, '08:00:00', '15:00:00', 3, 3),
(DEFAULT, 5, '13:00:00', '18:00:00', 2, 3);

INSERT INTO EventualSchedule VALUES(DEFAULT, '2021-08-30', '13:00:00', '15:00:00', 4, 1, 3),
(DEFAULT, '2021-08-30', '13:00:00', '15:00:00', 4, 1, 3),
(DEFAULT, '2021-09-23', '13:00:00', '15:00:00', 4, 2, 3);

INSERT INTO Appointment VALUES(DEFAULT, '2021-08-30 12:30:00', 'Default', 3, 1, 1),
(DEFAULT, '2021-09-20 13:30:00', 'Default', 3, 2, 1);
