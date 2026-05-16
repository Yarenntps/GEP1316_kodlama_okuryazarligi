#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

// Fonksiyon: Kullanci girdisini kontrol et ve geçerli bir double degerini geri döndür
// Parametre: sahaLabel - sahanin adi (örn: "Boy", "Kilo")
// Parametre: maxDenemeSayisi - maksimum deneme sayisi (default: 3)
// Dönüş: geçerli bir pozitif double degeri
double getValidInput(const string &sahaLabel, int maxDenemeSayisi = 3)
{
    double deger;
    int denemeSayisi = 0;

    while (denemeSayisi < maxDenemeSayisi)
    {
        cout << sahaLabel << " giriniz: ";
        cin >> deger;

        // Eger giriş basarisiz olduysa
        if (cin.fail())
        {
            cin.clear(); // Hata bayragini sifirla
            cin.ignore(10000, '\n'); // Hata yaratıcı karakterleri sil
            cout << "HATA: Geçerli bir sayı giriniz!\n";
            denemeSayisi++;
        }
        // Eger sayi sifir veya negatif ise
        else if (deger <= 0)
        {
            cout << "HATA: " << sahaLabel << " pozitif bir sayi olmali!\n";
            denemeSayisi++;
        }
        else
        {
            // Geçerli giriş alındı
            return deger;
        }
    }

    // 3 hata denemesinden sonra programı kapat
    cout << "\nProgram kapanıyor. Lütfen geçerli veriler giriniz.\n";
    exit(1);
}

// Fonksiyon: VKİ kategorisini belirle ve geri döndür
// Parametre: vki - hesaplanan VKİ degeri
// Dönüş: kategori metni
string getVKIKategorisi(double vki)
{
    if (vki < 18.5)
    {
        return "Zayif";
    }
    else if (vki >= 18.5 && vki < 25)
    {
        return "Normal";
    }
    else if (vki >= 25 && vki < 30)
    {
        return "Fazla Kilolu";
    }
    else
    {
        return "Obez";
    }
}

int main()
{
    cout << "=================================\n";
    cout << "  VUCUT KITLE INDEKSI HESAPLAYICI\n";
    cout << "=================================\n\n";

    // Boy ve kilo bilgilerini al
    double boy = getValidInput("Boy (metre cinsinden)", 3);
    double kilo = getValidInput("Kilo (kilogram cinsinden)", 3);

    // VKI hesapla
    double vki = kilo / (boy * boy);

    // VKI kategorisini belirle
    string kategori = getVKIKategorisi(vki);

    // Sonuçları ekrana yazdir
    cout << "\n=================================\n";
    cout << "           SONUCLAR\n";
    cout << "=================================\n\n";

    // Virgülden sonra 2 basamak göster
    cout << fixed << setprecision(2);
    cout << "Boy: " << boy << " m\n";
    cout << "Kilo: " << kilo << " kg\n";
    cout << "VKI: " << vki << "\n";
    cout << "Kategori: " << kategori << "\n\n";

    cout << "=================================\n";
    cout << "Teşekkür ederiz!\n";
    cout << "=================================\n";

    return 0;
}
