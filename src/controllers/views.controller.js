import productoModel from "../dao/models/producto.model.js";
import ProductManagerDB from "../dao/managersDB/productManagerDB.js";
import carritoModel from "../dao/models/carrito.model.js";
import userModel from "../dao/models/user.model.js";
import { GetUserDto } from "../dao/dto/user.dto.js";
import TicketManagerDB from "../dao/managersDB/ticketManagerDb.js";

const managerDB = new ProductManagerDB();
const ticketManager = new TicketManagerDB();

export default class viewController {
  async getHome(req, res) {
    try {
      const { limit = 5 } = req.query;
      const { page = 1 } = req.query;
      const sort = req.query.sort;
      const query = req.query.query;
      const {
        status,
        docs,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
      } = await productoModel.paginate({}, { limit, page, lean: true });
      const products = docs;
      const filter = await productoModel.find({ category: query });
      const prodsFilt = filter.map((item) => item.toObject());
      const orden = await productoModel.find().sort({ price: sort });
      const prodsOrd = orden.map((item) => item.toObject());
      console.log(orden);
      if (query) {
        res.render("home", {
          products: prodsFilt,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          page,
          sort,
          limit,
        });
      } else {
        if (sort) {
          res.render("home", {
            products: prodsOrd,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            page,
            sort,
            limit,
          });
        } else {
          res.render("home", {
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            page,
            sort,
            limit,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(req, res) {
    try {
      const { limit = 5 } = req.query;
      const { page = 1 } = req.query;
      const sort = req.query.sort;
      const query = req.query.query;
      const user = req.session.user;
      const userDto = new GetUserDto(user);
      const isAdmin = userDto.roles === "admin";
      const isPremium = userDto.roles === "premium";
      const {
        status,
        docs,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
      } = await productoModel.paginate({}, { limit, page, lean: true });
      const products = docs;
      const filter = await productoModel.find({ category: query });
      const prodsFilt = filter.map((item) => item.toObject());
      const orden = await productoModel.find().sort({ price: sort });
      const prodsOrd = orden.map((item) => item.toObject());
      console.log(orden);
      if (query) {
        res.render("products", {
          user: userDto,
          isAdmin,
          isPremium,
          products: prodsFilt,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          page,
          sort,
          limit,
        });
      } else {
        if (sort) {
          res.render("products", {
            user: userDto,
            isAdmin,
            isPremium,
            products: prodsOrd,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            page,
            sort,
            limit,
          });
        } else {
          res.render("products", {
            user: userDto,
            isAdmin,
            isPremium,
            products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            page,
            sort,
            limit,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async realTimeProducts(req, res) {
    try {
      const user = req.session.user;//
      const userDto = new GetUserDto(user);//
      const isAdmin = userDto.roles === "admin";//
      const isPremium = userDto.roles === "premium";//
      const productos = await managerDB.getProducts();
      const prods = productos.map((item) => item.toObject());
      prods[0].owner = req.session.user.email;
      prods[1].role = req.session.user.role;
      console.log("realtime", productos);
      res.render("realTimeProducts", {
        products: prods,
        user: req.session.user._id,
        role: req.session.user.role,
        isAdmin,
        isPremium
      });
    } catch (error) {
      console.log(error);
    }
  }

  async cartById(req, res) {
    try {
      const id_carrito = req.params.cid;
      const ticketId = req.params.ticketId;
      const productosCart = await carritoModel
        .findById(id_carrito)
        .populate("productos.product")
        .lean();
      const productos = productosCart.productos.map((item) => ({
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        idProducto: item.product._id,
      }));
      console.log("productosCart", productosCart);
      res.render("carts", {
        productos: productos,
        id: id_carrito,
        ticketId: ticketId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async chat(req, res) {
    try {
      res.render("chat", {});
    } catch (error) {
      console.log(error);
    }
  }

  async register(req, res) {
    try {
      res.render("register");
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    try {
      res.render("login");
    } catch (error) {
      console.log(error);
    }
  }

  async profile(req, res) {
    try {
      const user = req.session.user;
      const userDto = new GetUserDto(user);
      res.render("profile", {
        user: userDto,
      });
      console.log(userDto);
    } catch (error) {
      console.log(error);
    }
  }

  async forgotPassword(req, res) {
    try {
      res.render("forgotPassword");
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(req, res) {
    try {
      const token = req.query.token;
      res.render("resetPassword", { token });
    } catch (error) {
      console.log(error);
    }
  }

  async users(req, res) {
    try {
      const usersDb = await userModel.find();
      const users = usersDb.map((user) => new GetUserDto(user));
      console.log("viewscontroller users", users);
      res.render("users", {
        users,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
