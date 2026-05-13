# GEP1316_kodlama_okuryazarligi
Kodlama Okuryazarlığı dersi kapsamında açtığım ilk repo

## BMI Hesaplayıcı (C++)

Bu repoda `bmi_hesaplayici.cpp` adlı basit bir C++ konsol uygulaması bulunur.
Uygulama boy bilgisini **metre** cinsinden bekler ve şu sınırlarla doğrulama yapar:

- Boy: `0 < boy <= 2.5` metre
- Kilo: `0 < kilo <= 400` kilogram

### Derleme

```bash
g++ -std=c++17 -Wall -Wextra -pedantic bmi_hesaplayici.cpp -o bmi_hesaplayici
```

### Çalıştırma

```bash
./bmi_hesaplayici
```
