# työaikakirjanpito

| päivä | aika | mitä tein  |
| :----:|:-----| :-----|
| 2.-3.5. | 2 | backendin hahmottelua
| 3.5. | 6,5 | backend
| 8.5. | 2   | reduxin kanssa säätöä
| 18.-19.5. | 8 | frontend: kaikenlaista ml. käyttäjän sijainti ja google maps
| 19.5. | 3 | frontendiä, lisää tutustumista ja säätöä google mapsin kanssa
| 20.-21.5. | 8,5 | ulkoasua, refaktorointia, eriytystä
| 22.-23.5. | 6 | maps marker -säätöä, ulkoasua, vähän backendin kanssa säätöä
| 24.-25.5. | 9,5 | backend responset ja validoinnit aluilleen. Taistelua tyylien ja propsien kanssa.
| 25.-26.5. | 6,5 | 25.-26.5. | bugeja korjattu, havaintoja tarkennettu, validointia harrastettu
| 27.-28.5. | 10 | nodemailer, google api, debuggausta, ja säätämäistä kirjautumisen, aktivoinnin ja salasanan resetoinnin kanssa
| 28.-29.5. | 8 | Rekisteröitymisen parantelua, salasanan resetoinnissa käyttäjä asettaa, debuggausta, kokeiluja tyylien kanssa.
| 29.-30.5. | 7 | Havaintojen listaamisen parantaminen ja paginaten kanssa säätöä. Kartalla näyttäminen yksittäisenä. Flexbox-virittelyä.
| 30.5. | 3,5 | Syötteen validointia, listauksen parantelua ja debuggausta. Käyttäjän tietojen muutosmahdollisuuden luominen.
| 31.5. | 4 | Säätöä käyttäjähallinan ja ulkoasun kanssa. Settimeoutit kuntoon. Pahimpia sotkuja siivottu.

https://github.com/puhuri666/viklo-fstack18/blob/master/tuntikirja.xlsx

# yhteensä 84 tuntia

#  Käyttöohjeet

Sovelluksen sijainti: http://viklo.herokuapp.com/

EDIT: rekisteröitymistä ei näköjään edes kannata kokeilla, koska routet lahosivat täysin buildia rakentaessa...
Sovellusta voi käyttää testitunnuksilla (käyttäjä: timo@tes.ti, salasana: TimonOmaPassu6), tai tehdä uudet tunnukset. Uudet tunnukset vaativat kuitenkin toimivan sähköpostin, koska uusi tunnus tulee aktivoida sähköpostiin saapuvasta linkistä. Jos rekisteröitymistä haluaa kokeilla, niin sähköpostiosoitteet ovat sitten tietokannassa selväkielisenä.

Lisää-linkin alta voi lisätä omia lintuhavaintoja. Kohdassa laji tulee syöttää jokin hakusana, esimerkiksi "Kiljuhanhi" ja klikata lajia. Sitten valitaan sijainti kartalta, jonka saa auki klikkaamalla karttaikonia, tai syöttämällä esimerkiksi hakusanat "kumpula helsinki" input-kenttään. Tarkempi sijainti valintaa klikkaamalla kartaa, jolloin siihen ilmestyy uusi marker. Päivämäärä ja kellonaika on pakollinen tieto, mutta kommenttia ei tarvitse välttämättä syöttää.

Havainnot-sivulta löytää kaikki havainnot aikajärjestyksessä ja niitä voi tarkastella kartalla.

Käyttäjähallinassa voi muuttaa tunnuksen salasanaa ja yhteystietoja.

# Viklo - lintuharrastajan havaintokirja

Viklo on esikuvansa Tiiran (https://www.tiira.fi/) kaltainen verkkopalvelu, johon lintuharrastaja voi kirjata havaintojaan.

Käyttäjä luo profiilin, jonka yhteyteen liitetään kaikki hänen merkitsemänsä havainnot. Näille kaikille havainnoille annetaan sijainti ja kaikki havainnot merkitään kartalle. Kartalta voi tarkkailla kaikkien käyttäjien havaintoja ja rajoittaa havaintovälin päivien tarkkuudella. Kaikki havainnot löytyvät myös perinteisessä tekstimuodossa taulukoissa. 

Merkitessään sijantia käyttäjä voi tarkastella kartalta sopivan kohdan, syöttää osoitteen tai antaa palvelulle luvan paikantaa käyttäjän. Viimeinen vaihtoehto on ehdottoman kätevä, jos käyttäjä syöttää havaintoa maastosta käsin heti havainnon tehtyään.

Käyttäjät voivat lisätä toisensa kaveriksi. Havaintoa luodessa voidaan määritellä sen näkyväksi vain omille kavereille. Käyttäjät voivat vertailla omia havaintojaan kavereidensa vastaaviin.