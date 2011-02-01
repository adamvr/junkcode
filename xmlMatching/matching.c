#include <stdio.h>
#include <string.h>

// Table of matches and what to do when we get them

struct matchTableEntry {
    char *match;
    void (*cb)(char *);
};

void cb(char *);
struct matchTableEntry p = {"PLAIN", cb};
struct matchTableEntry s = {"success", cb};
struct matchTableEntry b = {"bind", cb};
struct matchTableEntry se = {"session", cb};

struct matchTableEntry *table[] = {&p, &s, &b, &se, NULL};

void cb(char * str) {
    printf("%s", str);
}

int main() {
    int i = 0;
    FILE* fp = fopen("./test", "r");
    char c = 1;
    while(c != -1) {
	c = (char) fgetc(fp);
	printf("%c", c);
    }
    /*
    for(i = 0; table[i]; i++) {
	table[i]->cb(table[i]->match);
	printf("\n");
    }
    */
    return 0;
}

