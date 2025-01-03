# NFT Ticketing

NFT Ticketing adalah sistem berbasis blockchain yang menggunakan NFT untuk mengelola dan menerbitkan tiket. Repository ini berisi kode sumber dan konfigurasi untuk melakukan deploy smart contract, menyiapkan platform network, dan menjalankan oracle.

## Kelompok J

| **NIM**     | **Nama**                  |
|-------------|---------------------------|
| 13521092    | Frankie Huang            |
| 18221067    | Fawwaz Abrial Saffa            |
| 18221123    | Abraham Megantoro Samudra            |
| 18221143    | Lie, Kevin Sebastian S. T.            |

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) dan npm
- [Hardhat](https://hardhat.org/)
- [Kurtosis](https://docs.kurtosistech.com/)
- [Docker](https://www.docker.com/)
- [Pinata](https://pinata.cloud/)
- Pengetahuan dasar tentang blockchain dan konsep NFT

## Struktur Repository

- **`smart-contract`**: Berisi smart contract untuk sistem ticketing.
- **`oracle`**: Berisi layanan oracle untuk dynamic pricing harga tiket.
- **`run.sh`**: Script untuk menyiapkan platform network.

## Panduan Memulai

### Deploy Smart Contract

1. Masuk ke folder `smart-contract`:

   ```bash
   cd smart-contract
   ```

2. Pastikan array `accounts` di file `hardhat.config.js` dalam keadaan **kosong**.

3. Buat wallet dengan menjalankan perintah berikut:

   ```bash
   node scripts/create-wallet.js
   ```

4. Deploy smart contract menggunakan Hardhat:

   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

### Menyiapkan Platform Network

1. Pastikan [Docker](https://www.docker.com/) sudah terinstal dan berjalan di sistem Anda.

2. Mulai Kurtosis Engine dengan perintah berikut:

   ```bash
   kurtosis engine start
   ```

3. Ubah hak akses script `run.sh` agar dapat dieksekusi:

   ```bash
   chmod +x run.sh
   ```

4. Jalankan script `run.sh` untuk menyiapkan platform:

   ```bash
   ./run.sh
   ```

### Menjalankan Oracle

1. Masuk ke folder `oracle`:

   ```bash
   cd oracle
   ```

2. Jalankan layanan oracle dengan perintah berikut:

   ```bash
   node index.js
   ```

### Menjalankan Client

1. Masuk ke folder `client`:

   ```bash
   cd client
   ```

2. Unduh dan install seluruh package yang dibutuhkan dengan perintah berikut:
   ```bash
   bun install
   ```

3. Isi konfigurasi .env berikut:
  ```bash
  NEXT_PUBLIC_DATABASE_URL=
  NEXT_PUBLIC_PINATA_JWT=
  NEXT_PUBLIC_PINATA_GATEWAY_URL=
  NEXT_PUBLIC_PINATA_GATEWAY_KEY=
  ```

4. Jalankan client dengan perintah berikut:

   ```bash
   bun dev
   ```

## Catatan

- Pastikan lingkungan Anda telah dikonfigurasi dengan benar sebelum menjalankan skrip apa pun.
- Pastikan menjalankan sesuai urutan
- Lihat kode dan komentar di folder terkait untuk detail implementasi lebih lanjut.
