export default function (req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/login");
    return;
  }

  if (req.role !== "admin") {
    res.redirect("/");
    return;
  }
  next();
}
