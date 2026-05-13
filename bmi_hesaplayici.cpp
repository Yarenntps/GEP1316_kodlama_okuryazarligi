#include <iomanip>
#include <iostream>

int main() {
    double boy = 0.0;
    double kilo = 0.0;

    // Kullanıcıdan boy bilgisini metre cinsinden al.
    std::cout << "Boyunuzu metre cinsinden girin (ornek: 1.75): ";
    std::cin >> boy;

    // Sayisal olmayan girisleri kontrol et.
    if (std::cin.fail()) {
        std::cout << "Hata: Gecersiz boy girdisi.\n";
        return 1;
    }

    // Pozitif ve mantikli deger kontrolu.
    if (boy <= 0.0) {
        std::cout << "Hata: Boy 0'dan buyuk olmalidir.\n";
        return 1;
    }

    // Kullanıcıdan kilo bilgisini kilogram cinsinden al.
    std::cout << "Kilonuzu kilogram cinsinden girin (ornek: 68): ";
    std::cin >> kilo;

    // Sayisal olmayan girisleri kontrol et.
    if (std::cin.fail()) {
        std::cout << "Hata: Gecersiz kilo girdisi.\n";
        return 1;
    }

    // Pozitif ve mantikli deger kontrolu.
    if (kilo <= 0.0) {
        std::cout << "Hata: Kilo 0'dan buyuk olmalidir.\n";
        return 1;
    }

    // BMI = kilo / (boy * boy) formulu ile hesapla.
    const double bmi = kilo / (boy * boy);

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "BMI degeriniz: " << bmi << '\n';

    // BMI kategorisini belirle ve kullanıcıyı bilgilendir.
    if (bmi < 18.5) {
        std::cout << "Kategori: Zayif\n";
    } else if (bmi < 25.0) {
        std::cout << "Kategori: Normal\n";
    } else if (bmi < 30.0) {
        std::cout << "Kategori: Fazla kilolu\n";
    } else {
        std::cout << "Kategori: Obez\n";
    }

    return 0;
}
