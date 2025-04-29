    const express = require('express');
    const mysql = require('mysql');
    const cors = require('cors');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    require('dotenv').config();

    const app = express();
    app.use(cors());
    app.use(express.json());

    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'filmomania'
    });

    app.use(express.static('public'));

    db.connect(err => {
        if (err) {
            console.error('Greška pri povezivanju sa bazom:', err);
            return;
        }
        console.log('✅ Povezan sa MySQL bazom');
    });

    // ✅ API za sve filmove
    app.get('/movies', (req, res) => {
        db.query('SELECT * FROM movies', (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    app.get('/movies/:id', (req, res) => {
        const movieId = req.params.id;

        const movieQuery = 'SELECT * FROM movies WHERE id = ?';
        const projectionsQuery = 'SELECT * FROM projections WHERE movie_id = ?';

        db.query(movieQuery, [movieId], (err, movieResults) => {
            if (err) return res.status(500).send(err);

            if (movieResults.length === 0) return res.status(404).send({ message: 'Film nije pronađen' });

            const movie = movieResults[0];

            db.query(projectionsQuery, [movieId], (err, projectionResults) => {
                if (err) return res.status(500).send(err);

                movie.projections = projectionResults; 
                res.json(movie); 
            });
        });
    });

    // ✅ API za pretragu filmova
    app.get('/movies/search/:term', (req, res) => {
        const searchTerm = `%${req.params.term}%`;
        db.query('SELECT * FROM movies WHERE title LIKE ?', [searchTerm], (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    });

    // Kreiranje JWT tokena
    function generateToken(userId) {
        const payload = { userId };
        const secretKey = process.env.JWT_SECRET || 'tajni_kljuc';  // Možeš postaviti ovaj ključ u .env fajl
        return jwt.sign(payload, secretKey, { expiresIn: '1h' });
    }

    // Middleware za verifikaciju JWT tokena
    function authenticateToken(req, res, next) {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ message: 'Nema tokena' });
        }
      
        jwt.verify(token, process.env.JWT_SECRET || 'tajni_kljuc', (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Nevalidan token' });
          }
          req.userId = decoded.userId;
          next();
        });
      }
      
    app.post('/api/register', async (req, res) => {
        const { username, password, email, fullName, phoneNumber } = req.body;

        // Check if all required fields are provided
        if (!username || !password || !email || !fullName || !phoneNumber) {
            return res.status(400).json({ message: 'Sva polja su obavezna' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = 'INSERT INTO users (username, password, email, full_name, phone_number) VALUES (?, ?, ?, ?, ?)';

            db.query(query, [username, hashedPassword, email, fullName, phoneNumber], (err, result) => {
                if (err) {
                    console.error('Database error:', err);  // Log the error to get more details
                    return res.status(500).json({ message: 'Greška pri registraciji korisnika' });
                }
                res.status(201).json({ message: 'Korisnik registrovan' });
            });
        } catch (err) {
            console.error('Error during bcrypt hashing:', err);  // Log bcrypt hashing error
            return res.status(500).json({ message: 'Greška pri enkripciji lozinke' });
        }
    });

    // Login korisnika
    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
        console.log('Korisnik pokušava da se uloguje:', username);
    
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) return res.status(500).json({ message: 'Greška na serveru' });
    
            if (results.length === 0) {
                return res.status(401).json({ message: 'Neispravno korisničko ime ili lozinka' });
            }
    
            const user = results[0];
            console.log('Korisnik pronađen:', user);
    
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Greška pri poređenju lozinke:', err);
                    return res.status(500).json({ message: 'Greška pri proveri lozinke' });
                }
    
                if (!isMatch) {
                    return res.status(401).json({ message: 'Neispravno korisničko ime ili lozinka' });
                }
    
                const token = generateToken(user.id);
                console.log('Token generisan:', token);
                res.status(200).json({ message: 'Ulogovani ste', token, user });
            });
        });
    });
    

    // Zaštićena ruta 
    app.get('/api/protected', authenticateToken, (req, res) => {
        res.status(200).json({ message: 'Dobrodošli na zaštićenu rutinu', userId: req.userId });
    });

    // Logout korisnika 
    app.post('/api/logout', authenticateToken, (req, res) => {
        const query = 'DELETE FROM tokens WHERE user_id = ?';
        db.query(query, [req.userId], (err) => {
            if (err) return res.status(500).json({ message: 'Greška pri logout-u' });

            res.status(200).json({ message: 'Uspešno ste se odjavili' });
        });
    });

    app.use((err, req, res, next) => {
        console.error('Greška:', err.stack);
        res.status(500).send('Nešto je pošlo po zlu!');
    });

    function queryAsync(query, values) {
        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Greška u queryAsync:', err);  // Logovanje greške
                    reject(err);
                }
                console.log('Upit uspešno izvršen:', result);  // Logovanje rezultata
                resolve(result);
            });
        });

    }
    // API ruta za dodavanje rezervacije
    app.post('/api/reservations', authenticateToken, async (req, res) => {
        const user_id = req.userId; // Ovdje dodeljujemo user_id
        const { movie_id, projection_id, date, time, price } = req.body;

        // Provera unosa
        if (!movie_id || !date || !time || !price) {
            return res.status(400).json({ message: 'Nedostaju obavezna polja' });
        }

        // Ovo je ispravno - logovanje unutar rute
        console.log({ user_id, movie_id, projection_id, date, time, price });

        const query = `
            INSERT INTO reservations (user_id, movie_id, projection_id, date, time, price, status)
            VALUES (?, ?, ?, ?, ?, ?, 'rezervisano')
        `;

        try {
            await queryAsync(query, [user_id, movie_id, projection_id || null, date, time, price]);
            res.status(201).json({ message: 'Rezervacija uspešno dodata' });
        } catch (err) {
            console.error('Greška pri kreiranju rezervacije:', err);
            res.status(500).json({ message: 'Greška pri kreiranju rezervacije' });
        }
    });



    // API ruta za prikaz rezervacija korisnika
    app.get('/api/reservations', authenticateToken, async (req, res) => {
        const user_id = req.userId;

        const query = `
            SELECT r.id, m.title AS movie_title, r.date, r.time, r.price, r.status,
                p.date_time AS projection_time
            FROM reservations r
            LEFT JOIN movies m ON r.movie_id = m.id
            LEFT JOIN projections p ON r.projection_id = p.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `;

        try {
            const results = await queryAsync(query, [user_id]);
            res.status(200).json(results);
        } catch (err) {
            console.error('Greška pri učitavanju rezervacija:', err);
            res.status(500).json({ message: 'Greška na serveru' });
        }
    });

    // API ruta za otkazivanje rezervacija
    app.put('/api/reservations/:id/cancel', authenticateToken, (req, res) => {
        const reservationId = req.params.id;
        const query = 'UPDATE reservations SET status = "otkazano" WHERE id = ? AND user_id = ?';

        db.query(query, [reservationId, req.userId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Greška pri otkazivanju rezervacije' });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Rezervacija nije pronađena ili nije vaša' });
            }

            res.status(200).json({ message: 'Rezervacija je otkazana' });
        });
    });

    // API ruta za brisanje rezervacija
    app.delete('/api/reservations/:id', authenticateToken, (req, res) => {
        const reservationId = req.params.id;
        const query = 'DELETE FROM reservations WHERE id = ? AND user_id = ?';

        db.query(query, [reservationId, req.userId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Greška pri brisanju rezervacije' });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Rezervacija nije pronađena ili nije vaša' });
            }

            res.status(200).json({ message: 'Rezervacija je obrisana' });
        });
    });

        // API ruta za proveru da lu korisnik ima vec rezervisan odredjeni film
        app.get('/api/reservations/check', (req, res) => {
            const { userId, movieId } = req.query;
            
            console.log('Provera rezervacije za korisnika:', userId, 'i film:', movieId);

            if (!movieId) return res.status(400).json({ message: 'movieId je obavezan' });

            db.query(
                'SELECT COUNT(*) AS count FROM reservations WHERE user_id = ? AND movie_id = ?',
                [userId, movieId],
                (err, results) => {
                    if (err) {
                        console.error('Greška pri proveri rezervacije:', err);
                        return res.status(500).json({ error: 'Greška u bazi' });
                    }
        
                    const exists = results[0].count > 0;
                    res.json({ exists }); // { exists: true } ili { exists: false }
                }
            );
        });
    

    // Start servera
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server pokrenut na portu ${PORT}`);
    });
