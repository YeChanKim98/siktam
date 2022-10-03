package com.service.searchplay.repository.user;

import com.service.searchplay.model.user.User;
import org.hibernate.annotations.Where;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Repository
public class JpaUserRepository implements UserRepository{

    @PersistenceContext
    private final EntityManager em;

    public JpaUserRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    public User join(User user) {
        em.persist(user);
        return user;
    }

    @Override
    @Where(clause="binary")
    public Optional<User> findById(String id) {
        System.out.println(id+"의 로그인 시도");
        Optional<User> user = em.createNativeQuery("SELECT * FROM user WHERE id= binary '"+id+"'", User.class)
                .getResultList().stream().findAny();
        return user;
    }

    @Override
    public String findId(String name, String address) {
        return em.createQuery("select u.id from User u where u.name=:name and u.email = :address")
                .setParameter("name",name)
                .setParameter("address",address)
                .getResultList().stream().findAny().get().toString();
    }

    @Override
    public String findPassword(String id, String address) {
        return em.createQuery("select u.password from User u where u.id=:id and u.email = :address")
                .setParameter("id",id)
                .setParameter("address",address)
                .getResultList().stream().findAny().get().toString();
    }

    @Override
    public List<User> findAll() {
        List<User> res = em.createQuery("select u from User u", User.class)
                .getResultList();
        return res;
    }

    @Override
    public int delete(String id) {
        return em.createQuery("delete from User u where u.id=:id")
                .setParameter("id", id)
                .executeUpdate();
    }

    @Override
    public int update(User user) {
        return em.createQuery("update User u set  u.name=:name, u.password=:password," +
                        " u.nickname=:nickname, u.email =:email, u.phone=:phone where u.id=:id")
                .setParameter("name",user.getName())
                .setParameter("password",user.getPassword())
                .setParameter("nickname",user.getNickname())
                .setParameter("email",user.getEmail())
                .setParameter("phone",user.getPhone())
                .executeUpdate();
    }

    @Override
    public int updateNickname(String id, String nickname) {
        return em.createQuery("update User u set u.nickname=:nickname where u.id=:id")
                .setParameter("nickname",nickname)
                .setParameter("id",id)
                .executeUpdate();
    }

    @Override
    public int updatePassword(String id, String password) {
        return em.createQuery("update User u set u.password=:password where u.id=:id")
                .setParameter("password",password)
                .setParameter("id",id)
                .executeUpdate();
    }

    @Override
    public int updateMail(String id, String mail) {
        return em.createQuery("update User u set u.email=:mail where u.id=:id")
                .setParameter("mail",mail)
                .setParameter("id",id)
                .executeUpdate();
    }

    @Override
    public int updatePhone(String id, String phone) {
        return em.createQuery("update User u set u.phone=:phone where u.id=:id")
                .setParameter("phone",phone)
                .setParameter("id",id)
                .executeUpdate();
    }
}
