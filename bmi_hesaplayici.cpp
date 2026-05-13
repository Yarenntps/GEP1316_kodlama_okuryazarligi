#include <iomanip>
#include <iostream>

int main() {
    double boy = 0.0;
    double kilo = 0.0;
    const double MAX_BOY_METRE = 2.5;
    const double MAX_KILO_KG = 400.0;

    // Kullanıcıdan boy bilgisini metre cinsinden al.
    std::cout << "Boyunuzu metre cinsinden girin (ornek: 1.75): ";
    std::cin >> boy;

    // Sayısal olmayan girişleri kontrol et.
    if (std::cin.fail()) {
        std::cout << "Hata: Gecersiz boy girdisi.\n";
        return 1;
    }

    // Pozitif ve mantıklı değer kontrolü.
    if (boy <= 0.0) {
        std::cout << "Hata: Boy 0'dan buyuk olmalidir.\n";
        return 1;
    }

    // Boyun metre cinsinden ve makul aralıkta girildiğini kontrol et.
    if (boy > MAX_BOY_METRE) {
        std::cout << "Hata: Boy metre cinsinden girilmeli ve " << MAX_BOY_METRE
            << " metreden buyuk olmamalidir (Lutfen cm girdiyseniz metreye cevirin).\n";
        return 1;
    }

    // Kullanıcıdan kilo bilgisini kilogram cinsinden al.
    std::cout << "Kilonuzu kilogram cinsinden girin (ornek: 68): ";
    std::cin >> kilo;

    // Sayısal olmayan girişleri kontrol et.
    if (std::cin.fail()) {
        std::cout << "Hata: Gecersiz kilo girdisi.\n";
        return 1;
    }

    // Pozitif ve mantıklı değer kontrolü.
    if (kilo <= 0.0) {
        std::cout << "Hata: Kilo 0'dan buyuk olmalidir.\n";
        return 1;
    }

    // Kilonun makul bir üst sınırı aşmadığını kontrol et.
    if (kilo > MAX_KILO_KG) {
        std::cout << "Hata: Kilo " << MAX_KILO_KG << " kg'dan buyuk olmamalidir.\n";
        return 1;
    }

    // BMI = kilo / (boy * boy) formulu ile hesapla.
    const double bmi = kilo / (boy * boy);

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "BMI degeriniz: " << bmi << '\n';

    // BMI kategorisini belirle ve kullanıcıyı bilgilendir.
    if (bmi < 18.5) {
        std::cout << "Kategori: Zayif\n";
    }
    else if (bmi < 25.0) {
        std::cout << "Kategori: Normal\n";
    }
    else if (bmi < 30.0) {
        std::cout << "Kategori: Fazla kilolu\n";
    }
    else {
        std::cout << "Kategori: Obez\n";
    }

    return 0;
}
