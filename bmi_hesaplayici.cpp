#include <iomanip>
#include <iostream>
#include <limits>

int main() {
    const double MAX_BOY_METRE = 2.5;
    const double MAX_KILO_KG = 400.0;

    std::cout << "|BMI Hesaplayici|\n";
    std::cout << std::fixed << std::setprecision(2);

    while (true) {
        double boy = 0.0;
        double kilo = 0.0;

        while (true) {
            std::cout << "Boyunuzu metre cinsinden girin (ornek: 1.75): ";
            std::cin >> boy;

            if (std::cin.fail()) {
                std::cout << "Hata: Gecersiz boy girdisi.\n";
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                continue;
            }

            if (boy <= 0.0) {
                std::cout << "Hata: Boy 0'dan buyuk olmalidir.\n";
                continue;
            }

            if (boy > MAX_BOY_METRE) {
                std::cout << "Hata: Boy metre cinsinden girilmeli ve " << MAX_BOY_METRE
                    << " metreden buyuk olmamalidir (Lutfen cm girdiyseniz metreye cevirin).\n";
                continue;
            }

            break;
        }

        while (true) {
            std::cout << "Kilonuzu kilogram cinsinden girin (ornek: 68): ";
            std::cin >> kilo;

            if (std::cin.fail()) {
                std::cout << "Hata: Gecersiz kilo girdisi.\n";
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                continue;
            }

            if (kilo <= 0.0) {
                std::cout << "Hata: Kilo 0'dan buyuk olmalidir.\n";
                continue;
            }

            if (kilo > MAX_KILO_KG) {
                std::cout << "Hata: Kilo " << MAX_KILO_KG << " kg'dan buyuk olmamalidir.\n";
                continue;
            }

            break;
        }

        const double bmi = kilo / (boy * boy);
        std::cout << "BMI degeriniz: " << bmi << '\n';

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

        int secim = 0;
        while (true) {
            std::cout << "Devam etmek istiyorsaniz 1, cikis yapmak icin 2 girin: ";
            std::cin >> secim;

            if (std::cin.fail()) {
                std::cout << "Hata: Gecersiz secim.\n";
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                continue;
            }

            if (secim == 1) {
                break;
            }

            if (secim == 2) {
                std::cout << "Hosca kalin <3 !\n";
                return 0;
            }

            std::cout << "Hata: Lutfen 1 veya 2 girin.\n";
        }
    }
}
