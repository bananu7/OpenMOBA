

function CollisionAABBCircle(aabb, circle)
{
	var circleDistanceX = Math.abs(circle.x - aabb.x);
    var circleDistanceY = Math.abs(circle.y - aabb.y);
	
	if (circleDistance.x > (aabb.w/2 + circle.r)) { return false; }
    if (circleDistance.y > (aabb.h/2 + circle.r)) { return false; }

    if (circleDistance.x <= (aabb.w/2)) { return true; } 
    if (circleDistance.y <= (aabb.h/2)) { return true; }
	
	cornerDistance_sq = (circleDistance.x - aabb.w/2)^2 +
                         (circleDistance.y - aabb.h/2)^2;
						 
	return (cornerDistance_sq <= (circle.r * circle.r));
}

function CollisionRectangleCirle(rectangle, circle)
{
}

function CollisionCircleCircle(c1x, c1y, c1r, c2x, c2y, c2r)
{
	return (c1x - c2x)*(c1x - c2x)+(c1y - c2y)*(c1y - c2y) 
			<= (c1r + c2r)*(c1r + c2r);
}
