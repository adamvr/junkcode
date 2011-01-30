#include <stdio.h>
#include <string.h>

// Table of matches and what to do when we get them

struct matchTable {
    char *match;
    void (*cb)(char *);
};

void cb(char *);
struct matchTable 

struct matchTable table[] = {{"PLAIN", cb}, {"success", cb},
		       {"bind", cb}, {"session", cb}};

int tableSize = 4;

void cb(char * str) {
    printf("%s", str);
}

int main() {
    int i = 0;
    for(i = 0; i < tableSize; i++) {
	table[i].cb(table[i].match);
	printf("\n");
    }
    return 0;
}

