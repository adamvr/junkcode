#include <string.h>
#include <stdio.h>

char array[] = "asdfasdfPLAINasdf";

int main() {
    printf("%s\n", strstr(array, ""));
    return 0;
}
