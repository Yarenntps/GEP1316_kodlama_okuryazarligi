#include <iomanip>
#include <iostream>

int main() {
    double boy = 0.0;
    double kilo = 0.0;

    // Kullanıcıdan boy bilgisini metre cinsinden al.
    std::cout << "Boyunuzu metre cinsinden girin (örnek: 1.75): ";
    std::cin >> boy;

    // Sayısal olmayan girişleri kontrol et.
    if (std::cin.fail()) {
        std::cout << "Hata: Geçersiz boy girdisi.\n";
        return 1;
    }

    // Pozitif ve mantıklı değer kontrolü.
    if (boy <= 0.0) {
        std::cout << "Hata: Boy 0'dan büyük olmalıdır.\n";
        return 1;
    }

    // Kullanıcıdan kilo bilgisini kilogram cinsinden al.
    std::cout << "Kilonuzu kilogram cinsinden girin (örnek: 68): ";
    std::cin >> kilo;

    // Sayısal olmayan girişleri kontrol et.
    if (std::cin.fail()) {
        std::cout << "Hata: Geçersiz kilo girdisi.\n";
        return 1;
    }

    // Pozitif ve mantıklı değer kontrolü.
    if (kilo <= 0.0) {
        std::cout << "Hata: Kilo 0'dan büyük olmalıdır.\n";
        return 1;
    }

    // BMI = kilo / (boy * boy) formulu ile hesapla.
    const double bmi = kilo / (boy * boy);

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "BMI değeriniz: " << bmi << '\n';

    // BMI kategorisini belirle ve kullanıcıyı bilgilendir.
    if (bmi < 18.5) {
        std::cout << "Kategori: Zayıf\n";
    } else if (bmi < 25.0) {
        std::cout << "Kategori: Normal\n";
    } else if (bmi < 30.0) {
        std::cout << "Kategori: Fazla kilolu\n";
    } else {
        std::cout << "Kategori: Obez\n";
    }

    return 0;
}
