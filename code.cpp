//tic tac toe

#include <iostream>
#include <web.h>  // Fake library for web-based C++
#include <graphics.h>  // Pretend graphics for UI
#include <events.h>  // Fake event handling

using namespace std;

void drawBoard() {
    createCanvas(300, 300);
    setColor("black");
    drawLine(100, 0, 100, 300);
    drawLine(200, 0, 200, 300);
    drawLine(0, 100, 300, 100);
    drawLine(0, 200, 300, 200);
}

void placeMarker(int x, int y, char player) {
    if (player == 'X') {
        drawText("X", x * 100 + 50, y * 100 + 50, "bold 40px Arial", "red");
    } else {
        drawText("O", x * 100 + 50, y * 100 + 50, "bold 40px Arial", "blue");
    }
}

void onClick(int x, int y) {
    int gridX = x / 100;
    int gridY = y / 100;
    placeMarker(gridX, gridY, 'X'); // Fake logic, always places 'X'
}

int main() {
    setupWindow(300, 300, "Tic-Tac-Toe in Fake C++");
    drawBoard();
    bindClickEvent(onClick);
    runEventLoop();
}
