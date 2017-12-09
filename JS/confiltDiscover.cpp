
if(posRect.width() > 1 || posRect.height() > 1){
                for (int coverX = x + posRect.left(); coverX <= x + posRect.right(); coverX++) {
                    for (int coverY = y + posRect.top(); coverY <= y + posRect.bottom(); coverY++) {
                        if(coverX < 0 || coverX >= layerToCheck->width() || coverY < 0 || coverY >= layerToCheck->height()) continue;
                        cover[layerToCheck].insert((coverX << 16) + coverY, (x << 16) + y);
                        }
                    }
                }