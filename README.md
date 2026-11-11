# Booty Builder – app completa (sport-fit.org/booty)

L'app vive qui su GitHub Pages: https://luka2pac-cyber.github.io/booty/
La pagina sport-fit.org/booty la mostra a schermo intero tramite iframe.

**Per aggiornare l'app: modificare solo `index.html` qui. Elementor non va toccato.**

File:
- `index.html` — app completa (home + questionario + area personale + Firebase/EmailJS).
- `bb-home-blok.html` — solo la home, come inviata da Alessia (v9-F). Da inserire in `index.html` tra `<!-- ===== NUOVA HOME` e `<!-- ===== NUOVA HOME — fine ===== -->`, mantenendo la sezione `id="s-login"` (Area personale).
- `elementor-app.html` — app completa da incollare in Elementor (metodo attuale, finche non si passa all iframe).
- `prenota.html` — calendario prenotazioni (pagina separata): https://luka2pac-cyber.github.io/booty/prenota.html — le atlete prenotano una fascia, Alessia entra da "Area Alessia" con la password. Dati in Firestore, raccolta `prenotazioni`.
- `firestore.rules` — regole Firestore da incollare nella console Firebase (Firestore > Rules).
- `elementor-iframe.html` — codice da incollare UNA volta nel widget HTML di Elementor.

ID da non rimuovere mai nella home: `bb-home`, `bb-root`, `s-login`, `l-email`, `l-pass`, `btn-login`, `btn-demo`, `btn-public-quiz`.

## Impostazione calendario prenotazioni (una sola volta)

Aprire questi link con l'account Google della palestra, in ordine:

1. **Attiva accesso con password:** https://console.firebase.google.com/project/booty-builder-65217/authentication/providers
2. **Crea l'utente di Alessia:** https://console.firebase.google.com/project/booty-builder-65217/authentication/users
3. **Regole Firestore:** https://console.firebase.google.com/project/booty-builder-65217/firestore/rules
   — il testo da incollare e nel file [firestore.rules](firestore.rules)
4. **Prova la pagina:** https://luka2pac-cyber.github.io/booty/prenota.html
